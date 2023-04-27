import os
import numpy as np
import cv2 as cv
import uvicorn

from insightface.app import FaceAnalysis
from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
from PIL import Image
from fastapi import FastAPI
from pydantic import BaseModel


class MlRequestBody(BaseModel):
    thumbnailPath: str


class ClipRequestBody(BaseModel):
    text: str


CACHE_FOLDER = '/cache'


classification_model = os.getenv(
    'MACHINE_LEARNING_CLASSIFICATION_MODEL', 'microsoft/resnet-50')
object_model = os.getenv('MACHINE_LEARNING_OBJECT_MODEL', 'hustvl/yolos-tiny')
clip_image_model = os.getenv(
    'MACHINE_LEARNING_CLIP_IMAGE_MODEL', 'clip-ViT-B-32')
clip_text_model = os.getenv(
    'MACHINE_LEARNING_CLIP_TEXT_MODEL', 'clip-ViT-B-32')
facial_recognition_model = os.getenv(
    'MACHINE_LEARNING_FACIAL_RECOGNITION_MODEL', 'buffalo_l')

_model_cache = {}

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Immich ML"}


@app.get("/ping")
def ping():
    return "pong"


@app.post("/object-detection/detect-object", status_code=200)
def object_detection(payload: MlRequestBody):
    model = _get_model(object_model, 'object-detection')
    assetPath = payload.thumbnailPath
    return run_engine(model, assetPath)


@app.post("/image-classifier/tag-image", status_code=200)
def image_classification(payload: MlRequestBody):
    model = _get_model(classification_model, 'image-classification')
    assetPath = payload.thumbnailPath
    return run_engine(model, assetPath)


@app.post("/sentence-transformer/encode-image", status_code=200)
def clip_encode_image(payload: MlRequestBody):
    model = _get_model(clip_image_model)
    assetPath = payload.thumbnailPath
    return model.encode(Image.open(assetPath)).tolist()


@app.post("/sentence-transformer/encode-text", status_code=200)
def clip_encode_text(payload: ClipRequestBody):
    model = _get_model(clip_text_model)
    text = payload.text
    return model.encode(text).tolist()


@app.post("/facial-recognition/detect-faces", status_code=200)
def facial_recognition(payload: MlRequestBody):
    model = _get_model(facial_recognition_model, 'facial-recognition')
    assetPath = payload.thumbnailPath
    img = cv.imread(assetPath)
    height, width, _ = img.shape
    results = []
    faces = model.get(img)
    for face in faces:
        if face.det_score < 0.7:
            continue
        x1, y1, x2, y2 = face.bbox
        # min face size as percent of original image
        if (x2 - x1) / width < 0.03 or (y2 - y1) / height < 0.05:
            continue
        x1, y1, x2, y2 = face.bbox.tolist()
        results.append({
            "boundingBox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
            "score": face.det_score.item(),
            "embedding": face.normed_embedding.tolist()
        })
    return results


def run_engine(engine, path):
    result = []
    predictions = engine(path)

    for index, pred in enumerate(predictions):
        tags = pred['label'].split(', ')
        if (pred['score'] > 0.9):
            result = [*result, *tags]

    if (len(result) > 1):
        result = list(set(result))

    return result


def _get_model(model, task=None):
    global _model_cache
    key = '|'.join([model, str(task)])
    if key not in _model_cache:
        if task:
            if task == 'facial-recognition':
                face_model = FaceAnalysis(
                    name=model, root=CACHE_FOLDER, allowed_modules=["detection", "recognition"])
                face_model.prepare(ctx_id=0, det_size=(640, 640))
                _model_cache[key] = face_model
            else:
                _model_cache[key] = pipeline(model=model, task=task)
        else:
            _model_cache[key] = SentenceTransformer(
                model, cache_folder=CACHE_FOLDER)
    return _model_cache[key]


if __name__ == "__main__":
    host = os.getenv('MACHINE_LEARNING_HOST', '0.0.0.0')
    port = int(os.getenv('MACHINE_LEARNING_PORT', 3003))
    is_dev = os.getenv('NODE_ENV') == 'development'

    uvicorn.run("main:app", host=host, port=port, reload=is_dev, workers=1)
