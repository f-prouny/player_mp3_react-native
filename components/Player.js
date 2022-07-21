/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { playlist } from '../playlist';
import NavBtn from './NavBtn';
import Sound from 'react-native-sound';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';



class Player extends Component {
    constructor(props) {
        super(props);
        Sound.setCategory('Playback');
    }
    state = {
        currentTrack: 0,
        playlist: playlist,
        playPause: false,
        gestureName: 'none',
        tranxAnim: new Animated.Value(1),
        timeManager: '00:00',
        totalTime: '00:00',
    }
    // pour gérér l'arret de mon setInterval
    mp3 = this.initSound();
    initSound(index = this.state.currentTrack) {
        console.log("index : " + index);
        const sound = new Sound(this.state.playlist[index].mp3, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            console.log('duration in seconds: ' + sound.getDuration() + 'number of channels: ' + sound.getNumberOfChannels());
            this.setState({totalTime:this.fancyTimeFormat(sound.getDuration())});
        });
        return sound;
    }
    playMp3() {
        let playPauseTmp = !this.state.playPause;
        this.setState({ playPause: playPauseTmp });
        if (!this.state.playPause) {
            // Play the sound with an onEnd callback
            this.mp3.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    this.mp3.setCurrentTime(0);
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        } else {
            // Pause
            this.mp3.pause();
        }
        this.time();
    }
    prev() {
        console.log("prev");
        this.setState({ playPause: true });
        this.mp3.pause();
        let index;
        // j'ai besoin de detecter si this.state.currentTrack - 1 < 0 ???
        if (this.state.currentTrack - 1 < 0) {
            index = this.state.playlist.length - 1;
        } else {
            index = this.state.currentTrack - 1;
        }
        this.transOut(index);
        this.mp3 = this.initSound(index);
        setTimeout(() => {
            this.mp3.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    this.mp3.setCurrentTime(0);
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }, 100);
        this.time();
    }
    next() {

        console.log("next");
        this.setState({ playPause: true });
        this.mp3.stop();
        this.mp3.release();
        let index;
        if (this.state.currentTrack === this.state.playlist.length - 1) {
            index = 0;
        } else {
            index = this.state.currentTrack + 1;
        }
        this.transOut(index);

        this.mp3 = this.initSound(index);
        setTimeout(() => {
            this.mp3.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                    this.mp3.setCurrentTime(0);
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }, 100);
        this.time();
    }
    // gestion swipe
    onSwipeLeft(gestureState) {
        console.log("next");
        this.next();
    }

    onSwipeRight(gestureState) {
        console.log("prev");
        this.prev();
    }

    onSwipe(gestureName, gestureState) {
        const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        this.setState({ gestureName: gestureName });
    }
    transOut(index) {
        // Will change  value to 1 in 5 seconds
        Animated.timing(this.state.tranxAnim, {
            toValue: 0,
            duration: 300,
        }).start(
            () => {
                this.setState({ currentTrack: index });
                this.transIn();
            }
        );
    }
    transIn() {
        Animated.timing(this.state.tranxAnim, {
            toValue: 1,
            duration: 300,
        }).start(
            () => {
                console.log('animation out et in terminée');
            }
        );
    }
    // gestion du temps
    fancyTimeFormat(duration) {
        // Hours, minutes and seconds
        let hrs = ~~(duration / 3600);
        let mins = ~~((duration % 3600) / 60);
        let secs = ~~duration % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        let ret = "";

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }
    
    time(){
        setInterval(
            ()=>{
                this.mp3.getCurrentTime(
                    (seconds)=>{
                        console.log(seconds);
                        this.setState({timeManager:this.fancyTimeFormat(seconds)});
                    }
                )
            },
            1000
        );
    }
    render() {
        return (
            <View style={{ width: '100%', backgroundColor: 'black', }}>
                <GestureRecognizer
                    onSwipe={(direction, state) => this.onSwipe(direction, state)}
                    onSwipeLeft={(state) => this.onSwipeLeft(state)}
                    onSwipeRight={(state) => this.onSwipeRight(state)}
                >
                    <Animated.Image
                        source={{ uri: 'asset:/img/cover/' + this.state.playlist[this.state.currentTrack].cover }}
                        style={[
                            styles.slider,
                            {
                                opacity: this.state.tranxAnim,
                            },
                        ]}
                    />
                </GestureRecognizer>
                <View style={styles.navigation}>
                    <NavBtn action={() => { this.prev(); }} icone={"/img/step-backward-solid.png"} />
                    <NavBtn action={() => { this.playMp3(); }} icone={this.state.playPause ? "/img/pause-solid.png" : "/img/play-circle-solid.png"} />
                    <NavBtn action={() => { this.next(); }} icone={'/img/step-forward-solid.png'} />
                </View>
                <View>
                    <Text style={styles.infoTxt}>{this.state.timeManager} / {this.state.totalTime}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoTxt}>{this.state.playlist[this.state.currentTrack].artist}</Text>
                    <Text style={styles.infoTxt}>{this.state.playlist[this.state.currentTrack].title}</Text>
                    <Text style={styles.infoTxt}>{this.state.playlist[this.state.currentTrack].annee}</Text>
                    <Text style={styles.infoTxt}>{this.state.playlist[this.state.currentTrack].genre}</Text>
                    <Text style={styles.infoTxt}>{this.state.playlist[this.state.currentTrack].description}</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    navigation: {
        width: '100%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 5,
    },
    slider: {
        width: '100%',
        height: 400,
        backgroundColor: 'skyblue',
    },
    info: {
        width: '100%',
        margin: 5,
        marginBottom:10,
    },
    infoTxt: {
        color: '#ffffff',
        textAlign:'center',
        fontSize:20,
    },
});
export default Player;
