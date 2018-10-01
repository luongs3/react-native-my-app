import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import { getPost, PostFeedType, getPostsFeed } from 'viblo-sdk/api/posts'
import Swiper from '../components/ReactNativeSwiper'
import { MonoText } from '../components/StyledText';
import LoadingScreen from '../components/LoadingScreen';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      currentPage: 0,
    }
  }

  componentDidMount() {
    this.fetchPosts()
  }

  loadMore() {
    this.fetchPosts(this.state.currentPage + 1)
  }

  fetchPosts(currentPage = 1) {
    getPostsFeed('editors-choice', { page: currentPage, limit: 5 })
      .then(({ data, meta: { pagination: { current_page: currentPage } } }) => {
        console.log('data', data)
        console.log('currentPage', currentPage)
        this.setState({
          data: [
            ...this.removeLastElement([...this.state.data]),
            ...data,
            {
              slug: 'special',
              isLoadingPage: true,
            }
          ],
          currentPage,
        }, () => { console.log(this.state.data)})
      })
      .catch(e => console.log('e', e))
  }

  removeLastElement(data) {
    if (data.length) {
      data.pop()
    }

    return data
  }

  renderItem(post, i) {
    if (post.isLoadingPage) {
      return <LoadingScreen key={post.slug} />
    }

    return (
      <ScrollView key={post.slug}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>i: {i}</Text>
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{post.title}</Text>
          <Text>{post.contents_short}</Text>
        </View>
      </ScrollView>
    )
  }

  render() {
    if (!this.state.data.length) {
      return null
    }

    return (
      <View style={styles.container}>
        <Swiper
          loadMinimal
          loadMinimalSize={1}
          style={styles.container}
          loop={false}
          onMomentumScrollEnd={() => console.log('onMomentumScrollEnd')}
          onScrollBeginDrag={() => console.log('onScrollBeginDrag')}
        >
          {
            this.state.data.map((post, i) => this.renderItem(post, i))
          }
        </Swiper>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
