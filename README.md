# react-native-fullscreen-media-kit
    基于 #ldn0x7dc/react-native-media-kit 进行功能增加。
    新增功能：
    1、支持全屏播放和指定大小播放切换。
    2、全屏播放时，显示视频标及返回按钮。
    3、3秒自动渐变隐藏播放控制栏及标题栏，点击视频渐变显示控制栏 。
    4、支持多种分辨率切换。

Video(and audio) component for react-native apps, supporting both iOS and Android, with API similar to HTML video.

A default set of controls is provided to play/pause, seek and to display current playback and buffer progress.

Runs on react-native 0.28+ (The limit exists due to [ActivityIndicator](https://facebook.github.io/react-native/docs/activityindicator.html) comes after 0.28).

Supported media types:

* iOS: Should be same as those supported by [AVPlayer](https://developer.apple.com/library/ios/documentation/AVFoundation/Reference/AVPlayer_Class/)


* Android: Shold be same as those supported by [ExoPlayer](https://github.com/google/ExoPlayer)

![](Demo/play.png).
![](Demo/fullscreen.png).

## Install

`npm install --save react-native-fullscreen-media-kit`

#### iOS

For now, just drag ***react-native-media-kit.xcodeproj*** into your Xcode project and link the **libreact-native-media-kit.a** library.

#### Android

**android/settings.gradle**

```
include ':react-native-fullscreen-media-kit'
project(':react-native-fullscreen-media-kit').projectDir = new File('../node_modules/react-native-fullscreen-media-kit/android')
```

**android/app/build.gradle**

```
dependencies {
    ...
    compile project(':react-native-fullscreen-media-kit')
}
```

**MainActivity.java (or MainApplication on rn 0.29+)**

```
import com.greatdroid.reactnative.media.MediaKitPackage;
...
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
            new MediaKitPackage()
    );
}
```



## Documentation

```
import {Video} from 'react-native-fullscreen-media-kit';
...
fullScreen(){
    this.forceUpdate() ; // 横屏强制刷新
  }
render() {
  let width = Dimensions.get('window').width ; 
    let height = width / (16/9) ;
    let screenStatus = 1 ;
    let bottomView ;
    let videoStyle ;
    if(this.video) //获取手机屏幕方向，0：横屏
      screenStatus = this.video.getScreenStatus();
    if(screenStatus == 0 ) {
      videoStyle = {width:width , flex:1} ;
    }else{
      bottomView = (
      <Text>
        i am a long string \r\n long \r\n long/n...can change line ?
        </Text>
      );
      videoStyle = {width:width,height:height} ;
    }
    //非全屏显示bottomView.
    return (
      <View style={styles.container}>
        <Video
          style={videoStyle}
          src={'http://v.yoai.com/femme_tampon_tutorial.mp4'}
          autoplay={false}
          preload={'none'}
          loop={false}
          controls={true}
          muted={false}
          ref={(video)=>this.video = video}
          screenUpdate={this.fullScreen.bind(this)}
          poster={'http://static.yoaicdn.com/shoppc/images/cover_img_e1e9e6b.jpg'}
          videoTitle={"如何使用初密"}
          />
        {bottomView}
      </View>
    );
}

```

### API

The API is designed to mimics html [`<video />`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). (*For now, the Video and Audio component are identical*)

##### Properties

| key                  | value                                    | iOS  | Android |
| -------------------- | ---------------------------------------- | ---- | ------- |
| src                  | the URL of the video                     | OK   | OK      |
| autoplay             | true to automatically begins to play. Default is false. | OK   | OK      |
| preload              | can be 'none', 'auto'. Default is 'none'. | OK   | OK      |
| loop                 | true to automatically seek back to the start upon reaching the end of the video. Default is 'false'. | OK   | OK      |
| controls             | true to show controls to allow user to control video playback, including seeking, and pause/resume playback. Default is true. | OK   | OK      |
| poster               | an image URL indicating a poster frame to show until the user plays. | OK   | OK      |
| muted                | true to silence the audio. Default is false. | OK   | OK      |
| onPlayerPaused       |                                          | OK   | OK      |
| onPlayerPlaying      |                                          | OK   | OK      |
| onPlayerFinished     |                                          | OK   | OK      |
| onPlayerBuffering    |                                          | OK   | OK      |
| onPlayerBufferOK     |                                          | OK   | OK      |
| onPlayerProgress     |                                          | OK   | OK      |
| onPlayerBufferChange |                                          | OK   | OK      |

- ***pause***
- ***play***
- ***stop***
- ***seekTo***


For details about the usage of above APIs, check `library/MediaPlayerView.js`.



## TODO

* background play
