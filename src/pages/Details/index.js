import React from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

// import { Container } from './styles';

export default function Details({ navigation }) {
  const user = navigation.getParam('user');
  return <WebView source={{ uri: user.html_url }} style={{ flex: 1 }} />;
}

Details.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Details.navigationOptions = () => ({
  title: 'Github',
});
