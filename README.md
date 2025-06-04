# Obsense App

Obsense is an immersive AR (Augmented Reality) mobile application that allows 3D-artists to create, place, and edit digital art collections in AR. Users can browse, purchase, and experience these collections in augmented reality.

## Features

## Screenshots

![Home Screen](assets/images/HomeScreen.jpg)
![Collection Details](assets/images/CollectionDetails.jpg)
![AR Collection View](assets/images/ARView.jpg)

### Artist Features

- Artist authentication
- Place 3D-objects in AR collections
- View and interact with collections in AR
- User profile and settings management

### User Features

- User authentication
- Browse collections, artists, and genres
- Search and purchase collections
- Token-based purchasing system
- View and interact with collections in AR
- User profile and settings management
- Reporting

## Installation

1. **Clone the repository:**

   ```bash
   git clone git@github.com:Stijn-Houwelijckx/obsense-app.git
   cd obsense-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Metro bundler:**

   ```bash
   npx react-native start
   ```

4. **Prepare your Android device:**

   - Connect your Android device to your computer with a USB cable.
   - Enable Developer Mode and USB debugging on your device.
   - In a terminal, run:

   ```bash
   adb devices
   ```

   Approve the connection on your device if prompted.

5. **Run the app on Android:**

   Choose the option to run for Android

   > **Note:** The app requires a physical device because it uses AR features that are not supported in emulators.

## Usage

### For Artists

- Sign up as an artist
- Edit your own collections
- Place 3D-objects in AR collections
- View and interact with your collections in AR

### For Users

- Sign up as a user
- Browse collections, artists, and genres
- Purchase collections using tokens
- View and interact with collections in AR

## Project Structure

```
src/
  components/      # Reusable UI components
  context/         # React context providers
  navigation/      # Navigation stacks and tab navigators
  screens/         # App screens (User, Artist, Shared)
  styles/          # Theme and global styles
  utils/           # API, helpers, and utility functions
  assets/          # Images, animations, and videos
```

## Technologies

- React Native
- @reactvision/react-viro (AR)
- React Navigation
- AsyncStorage
- Axios
- FastImage
- Custom UI components

## License

This project is licensed under the Obsense Proprietary License. See the [LICENSE](LICENSE) file for details.
