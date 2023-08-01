from io import BytesIO
from typing import Any

from huggingface_hub import snapshot_download
from optimum.onnxruntime import ORTModelForImageClassification
from optimum.pipelines import pipeline
from PIL import Image
from transformers import AutoImageProcessor

from ..schemas import ModelType
from .base import InferenceModel


class ImageClassifier(InferenceModel):
    _model_type = ModelType.IMAGE_CLASSIFICATION

    def load(self, min_score: float = 0.9, **model_kwargs: Any) -> None:
        self.min_score = min_score
        super().__init__(model_name, cache_dir, **model_kwargs)

    def _download(self, **model_kwargs: Any) -> None:
        snapshot_download(
            cache_dir=self.cache_dir,
            repo_id=self.model_name,
            allow_patterns=["*.bin", "*.json", "*.txt"],
            local_dir=self.cache_dir,
            local_dir_use_symlinks=True,
        )

    def _load(self, **model_kwargs: Any) -> None:
        processor = AutoImageProcessor.from_pretrained(self.cache_dir)
        model_kwargs |= {
            "cache_dir": self.cache_dir,
            "provider": self.providers[0],
            "provider_options": self.provider_options[0],
            "session_options": self.sess_options,
        }
        model_path = self.cache_dir / "model.onnx"

        if model_path.exists():
            model = ORTModelForImageClassification.from_pretrained(self.cache_dir, **model_kwargs)
            self.model = pipeline(self.model_type.value, model, feature_extractor=processor)
        else:
            self.sess_options.optimized_model_filepath = model_path.as_posix()
            self.model = pipeline(
                self.model_type.value,
                self.model_name,
                model_kwargs=model_kwargs,
                feature_extractor=processor,
            )

    def _predict(self, image: Image.Image | bytes) -> list[str]:
        if isinstance(image, bytes):
            image = Image.open(BytesIO(image))
        predictions: list[dict[str, Any]] = self.model(image)  # type: ignore
        tags = [tag for pred in predictions for tag in pred["label"].split(", ") if pred["score"] >= self.min_score]

        return tags

    def configure(self, **model_kwargs: Any) -> None:
        self.min_score = model_kwargs.get("min_score", self.min_score)
