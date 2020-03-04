import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure({ host: '192.168.100.32' })
    .useReactNative()
    .connect();

  console.tron = tron;

  // Refresh timeline in every ctrl+s
  tron.clear();
}
