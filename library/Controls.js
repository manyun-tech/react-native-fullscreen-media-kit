import React, {PropTypes} from 'react';

import ReactNative, {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  NativeModules,
  requireNativeComponent,
  Dimensions,
  ScrollView,
  Image,
  Platform,
  Animated ,
  TouchableWithoutFeedback
} from 'react-native';

import Slider from '@ldn0x7dc/react-native-slider';

/**
 * format as --:-- or --:--:--
 * @param timeSec
 * @param containHours
 * @returns {string}
 */
function formatProgress(timeSec, containHours) {
  function zeroPad(s) {
    if (s.length === 1) {
      return '0' + s;
    }
    return s;
  }

  let hours = Math.floor(timeSec / 60.0 / 60.0).toFixed(0);
  let minutes = Math.floor(timeSec / 60.0 % 60.0).toFixed(0);
  let seconds = Math.floor(timeSec % 60.0).toFixed(0);

  if(hours < 0) {
    hours = 0;
  }
  if (minutes < 0) {
    minutes = 0;
  }
  if(seconds < 0) {
    seconds = 0;
  }

  hours = zeroPad(hours);
  minutes = zeroPad(minutes);
  seconds = zeroPad(seconds);

  if (containHours) {
    return hours + ':' + minutes + ':' + seconds;
  }
  return minutes + ':' + seconds;
}
export default class Controls extends React.Component {

  defaultProps = {
    current: 0,
    total: 0,
    buffering: false,
    playing: false, 
    screenOrientation: 1 
  }

  constructor(props) {
    super(props);
    this.state = {
      sliding: false,
      current: this.props.current,
      selectSource:0,
      showAllSourceView:false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.sliding) {
      if (this.props.current != nextProps.current) {
        this.setState({
          current: nextProps.current,
        });
      }
    }
  }
  componentWillUnmount(){
    this.timer&&clearTimeout(this.timer);
  }
  render() {
    const containHours = this.props.total >= 60 * 60 * 1000;
    const currentFormated = formatProgress(this.state.current / 1000, containHours);
    const totalFormated = formatProgress(this.props.total / 1000, containHours);

    let tracks = [];
    if(this.props.bufferRanges) {
      tracks = this.props.bufferRanges.map((range) => {
        let startValue = range.start;
        let endValue = startValue + range.duration;
        return {
          key: 'bufferTrack:' + startValue + '-' + endValue,
          startValue, endValue,
          style: {backgroundColor: '#eeeeee66'}
        }
      });
    }
    tracks.push(
      {
        key: 'thumbTrack',
        style: {backgroundColor: 'white'}
      }
    );
    let selectSourceView ;
    
    if(this.props.showSource){
      selectSourceView = (
        <TouchableOpacity 
        onPress={this.props.showAllSourceView}
        style={{width:40,height:40,alignItems:"center",justifyContent:"center"}}>
          <Text style={{textAlign:"center",fontSize:12,color:"white"}}>{this.props.sourceName}</Text>
        </TouchableOpacity>
      ) ;
    }

    return (
      <View
        style={{
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center' ,height:45
        }}>
        
        <View
          style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, backgroundColor: '#00000088', flexDirection: 'row'}}>

          <TouchableOpacity
            onPress={this.props.onPauseOrPlay}
            style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center',marginLeft:10}}>
            <Image
              style={{width: 24, height: 24, resizeMode: 'contain'}}
              source={this.props.playing ? require('./img/pause.png') : require('./img/play.png')}/>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.props.next}
            style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={{width: 24, height: 24, resizeMode: 'contain'}}
              source={require("./img/next.png")}/>
          </TouchableOpacity>

          <Text
            style={{alignSelf: 'center', fontSize: 12, color: 'white', width: currentFormated.length == 5 ? 35:56, textAlign: 'right'}}>
            {currentFormated}
          </Text>
          <Text
            style={{alignSelf: 'center', fontSize: 12, color: 'white'}}>
                /  
          </Text>
          <Text
            style={{alignSelf: 'center', fontSize: 12, color: 'white', width: totalFormated.length == 5 ? 35:56, marginRight: 10}}>
              {totalFormated}
          </Text>
          <View style={{flex:1,justifyContent:"flex-end",flexDirection:"row"}}>
            {selectSourceView}
            <TouchableOpacity style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
                onPress={this.props.fullScreen}>
                <Image 
                    source={this.props.screenOrientation == 0 ? require("./img/exit-fullscreen.png"): require("./img/fullscreen.png")}
                    style={{width:22,height:22}}/>
            </TouchableOpacity>
          </View>
          
        </View>
        <Slider
            style={{flex: 1 ,height:10, position:'absolute',left:0,top:0,right:0}}
            trackContainerStyle={{height: 2, backgroundColor: 'gray'}}
            thumbImage={require('./img/media-player-thumb.png')}
            thumbStyle={{width: 10, height: 10}}
            
            onSlidingComplete={(value) => {
              console.log("slider value = " + value ) ;
              this.setState({
                sliding: false,
                current: value
              });
              this.props.onSeekTo && this.props.onSeekTo(value);
            }}
            onValueChange={(value) => {
              this.setState({
                sliding: true,
                current: value
              });
            }}
            maximumValue={this.props.total}
            minimumValue={0}
            value={this.state.current}
            disabled={this.props.total > 0}
            tracks={tracks}
          />
      </View>
    );
  }
}