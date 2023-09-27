declare module 'react-native-image-picker' {
    interface ImagePickerResponse {
      customProperty: string; // Define custom properties as needed
    }
  
    export default class ImagePicker {
      static showImagePicker(
        options: any,
        callback: (response: ImagePickerResponse) => void
      ): void;
    }
  }
  