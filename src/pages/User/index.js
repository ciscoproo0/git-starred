/* eslint-disable react/no-unused-state */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';

import {
  Container,
  Header,
  Name,
  Bio,
  Avatar,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  SearchButton,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
    headerBackTitle: '',
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 2,
  };

  async componentDidMount() {
    const { navigation } = this.props;

    this.setState({ loading: true });

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  }

  refreshList = async () => {
    const { navigation } = this.props;

    this.setState({ loading: true });

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false, page: 2 });
  };

  loadMore = async () => {
    const { navigation } = this.props;

    const { page, stars } = this.state;

    this.setState({ loading: true });

    // prevents onEndReachedThreshold if there is no more data
    if (Object.keys(stars).length < 30) {
      this.setState({ loading: false });
    } else {
      const user = navigation.getParam('user');

      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page,
        },
      });

      this.setState({
        stars: response.data,
        loading: false,
        page: page + 1,
      });
    }
  };

  handleNavigate = user => {
    const { navigation } = this.props;
    navigation.navigate('Details', { user });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.1}
            onEndReached={() => this.loadMore()}
            onRefresh={this.refreshList}
            refreshing={loading}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
                <SearchButton onPress={() => this.handleNavigate(item)}>
                  <Icon name="search" size={20} color="#FFF" />
                </SearchButton>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
