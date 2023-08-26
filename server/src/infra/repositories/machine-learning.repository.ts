import { DetectFaceResult, IMachineLearningRepository, TextModelInput, VisionModelInput } from '@app/domain';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { CLIPConfig, CLIPMode, ClassificationConfig, ModelConfig, RecognitionConfig } from '../../domain/system-config/dto/system-config-machine-learning.dto';

const client = axios.create();

@Injectable()
export class MachineLearningRepository implements IMachineLearningRepository {
  private async post<T>(url: string, input: TextModelInput | VisionModelInput, config: ModelConfig): Promise<T> {
    const formData = this.getFormData(input, config);
    const res = await client.post<T>(`${url}/predict`, formData, { headers: formData.getHeaders() });
    return res.data;
  }

  classifyImage(url: string, input: VisionModelInput, config: ClassificationConfig): Promise<string[]> {
    return this.post<string[]>(url, input, config);
  }

  detectFaces(url: string, input: VisionModelInput, config: RecognitionConfig): Promise<DetectFaceResult[]> {
    return this.post<DetectFaceResult[]>(url, input, config);
  }

  encodeImage(url: string, input: VisionModelInput, config: CLIPConfig): Promise<number[]> {
    return this.post<number[]>(url, input, { ...config, mode: CLIPMode.VISION } as CLIPConfig);
  }

  encodeText(url: string, input: TextModelInput, config: CLIPConfig): Promise<number[]> {
    return this.post<number[]>(url, input, { ...config, mode: CLIPMode.TEXT } as CLIPConfig);
  }

  getFormData(input: TextModelInput | VisionModelInput, config: ModelConfig): FormData {
    const formData = new FormData();
    const { modelName, modelType, ...options } = config;

    formData.append('modelName', modelName);
    formData.append('modelType', modelType);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }
    if ('imagePath' in input) {
      const fileStream = createReadStream(input.imagePath);
      formData.append('image', fileStream);
    } else if ('text' in input) {
      formData.append('text', input.text);
    } else {
      throw new Error('Invalid input');
    }

    return formData;
  }
}
