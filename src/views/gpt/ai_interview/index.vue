<template>
    <div class="app-container" style="height: 750px; background:  #f6f6f6;">
        <el-container>
            <el-row :gutter="24">
                <el-col :span="16">
                    <div class="grid-content bg-purple" style="margin-left: 20px;">

                        <el-card  class="box-card" style="width: 600px; height:600px;">
                            <!-- 视频区域 -->
                            <video ref="videoPlayer" poster="https://create-images-results.d-id.com/api_docs/assets/noelle.jpeg" autoplay="true" width="100%">
                                <source :src="videoSrc" type="video/mp4">
                            </video>
                        </el-card>

                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <!-- 消息面板区域 -->
                        <el-card class="box-card" style="width: 400px; padding: 0;">
                            <!-- 录制 -->
                            <div class="record">
                                <el-button @click="recBtn" v-model="iconBtn" class="recordBtn"
                                    style="width: 80px; height: 80px;" type="primary" :icon="iconBtn" circle></el-button>
                                <div class="recText" v-show="!loadingRec"> 点击麦克风开始说话 </div>
                                <div class="recText" v-show="loadingRec"> 正在识别 <i class="el-icon-loading"></i></div>
                            </div>

                        </el-card>
                        <el-card class="box-card" style="width: 400px; height: 350px;">
                            <ul class="infinite-list" v-infinite-scroll="load" style="height: 300px;overflow:auto">
                                <!-- 视频区域 -->
                                <div class="respText" v-show="textContext.length < 1">请开始对话</div>
                                <div class="text" v-for="(item, index) in textContext.length">
                                    <div class="respText" style="" v-if="index % 2 != 0"> YOU:
                                    
                                        <div class="context">
                                            {{ textContext[index] }}
                                        </div>

                                    </div>
                                    <div style=" color: #f74444;" class="respText" v-if="index % 2 == 0"> 
                                        <!-- 头像 -->
                                        <div class="block"><el-avatar :size="30" :src="circleUrl"></el-avatar></div>
                                        <!-- 内容 -->
                                        <div class="context">
                                            {{textContext[index] }}
                                        </div>
                                    </div>
                                </div>
                                <div class="respText" style=" color: #f74444;" v-show="loadingGpt"><el-skeleton
                                        style="margin-top: 10px;" :rows="3" animated /></div>



                                <!-- <span >  <i
                                        class="el-icon-loading"></i></span> -->
                            </ul>


                        </el-card>

                    </div>
                </el-col>
            </el-row>
        </el-container>

    </div>
</template>

<script>
import Recorder from 'js-audio-recorder';
import { iat } from '@/api/gpt/ai_interview'
import { genDidClip } from '@/api/gpt/ai_interview'
import { genDidTalk } from '@/api/gpt/ai_interview'
import { getGptResp } from '@/api/gpt/ai_interview'


export default {
    name: "aiInterview",
    data() {
        return {
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            iconBtn: 'el-icon-microphone',
            load: null,
            //加载
            loadingGpt: false,
            loadingDid: false,
            loadingRec: false,
            //录音变量
            recordResult: [],
            recordStuats: 0,//0录制，1停止录制
            recorder: null,
            playTime: 0,
            timer: null,
            src: null,

            //视频变量
            videoSrc: 'https://d-id-talks-prod.s3.us-west-2.amazonaws.com/auth0%7C648c34b6e5ad48ee2ec0083f/tlk_usNHrKN8wOhHh_sWJ6ZAP/1686969447332.mp4?AWSAccessKeyId=AKIA5CUMPJBIK65W6FGA&Expires=1687055849&Signature=VJ9ydjHBiowwhhrnZMIF44MSfxY%3D&X-Amzn-Trace-Id=Root%3D1-648d1c69-1d313ab123c7e1c50a9c139c%3BParent%3Dd84d97aba697c1a4%3BSampled%3D1%3BLineage%3D6b931dd4%3A0',
            // videoSrc:'./video/startVideo.mp4',
            currentSrcIndex: 0,
            lastFrame: null,

            //gpt
            textContext: [],
            gptResult: []
        }
    },
    created() {
        this.recorder = new Recorder()
        this.textContext.push("老师您好，我准备好听课啦！")
        this.gptResult.push("老师您好，我准备好听课啦！")
    },
    methods: {
        // //--------------------------------加载视频------------------
        // loadVideo() {
        //     const video = this.$refs.videoPlayer
        //     video.src = this.videoSrcs
        //     video.currentTime = this.lastFrame || 0
        //     video.load()
        //     video.play()
        // },
        //--------------------------------录音------------------
        startRecording() {
            var that = this
            if (this.recorder == null || this.recorder.duration === 0) {
                this.$message({
                    message: '请先录音',
                    type: 'error'
                })
                return false
            }
            this.recorder.pause() // 暂停录音
            this.timer = null
            console.log('上传录音')// 上传录音

            const formData = new FormData()

            const blob = this.recorder.getPCMBlob()// 获取wav格式音频数据

            // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
            const newbolb = new Blob([blob], { type: 'audio/pcm' })
            const file = new File([newbolb], new Date().getTime() + '.pcm')
            formData.append('file', file)
            const url = window.URL.createObjectURL(file)
            this.src = url
            console.log(newbolb)// 上传录音
            that.loadingRec = true
            iat(formData).then(response => {
                if (response.code == 200) {
                    var msg = response.msg
                    const jsonResponse = JSON.parse(msg);
                    const result = jsonResponse.result;
                    console.log(result[0])

                    this.recordResult.push(result[0])
                    this.textContext.push(result[0])

                    that.loadingGpt = true
                    that.loadingRec = false

                    console.log(this.recordResult[this.recordResult.length - 1])
                    console.log(this.recordResult)
                    console.log(this.gptResult[this.gptResult.length - 1])
                    console.log(this.gptResult)
                    that.getGptRes(result[0], this.recordResult[this.recordResult.length - 1], this.gptResult[this.gptResult.length - 1])
                } else {
                    that.$notify.error({
                        title: 'iat失败',
                        message: response.msg
                    });
                    that.loadingRec = false
                }

            })


        },
        // 开始录音
        handleStart() {
            this.recorder = new Recorder({
                sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
                sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
                numChannels: 1 // 声道，支持 1 或 2， 默认是1
                // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
            })
            Recorder.getPermission().then(() => {
                console.log('开始录音')
                this.recorder.start() // 开始录音
            }, (error) => {
                this.$message({
                    message: '请先允许该网页使用麦克风',
                    type: 'info'
                })
                console.log(`${error.name} : ${error.message}`)
            })
        },
        handleStop() {
            console.log('停止录音')
            this.recorder.stop() // 停止录音
        },
        handleDestroy() {
            console.log('销毁实例')
            this.recorder.destroy() // 毁实例
            this.timer = null
        },
        recBtn() {
            var that = this
            if (this.recordStuats == 0) {
                this.recordStuats = 1
                this.iconBtn = "el-icon-video-pause"
                //录制
                this.handleStart()

            } else if (this.recordStuats == 1) {
                this.handleStop()
                this.recordStuats = 0
                this.iconBtn = "el-icon-loading"
                this.startRecording()
                that.iconBtn = "el-icon-microphone"

            }
        },
        //--------------------------------gpt------------------
        getGptRes(input, context, gptcontext) {
            // genDidVideo(){
            var that = this
            getGptResp(input, context, gptcontext).then(resp => {
                that.loadingGpt = false

                if (resp.code == 200) {
                    var msg = resp.msg
                    console.log(msg)
                    that.gptResult.push(msg)
                    that.textContext.push(msg)
                    that.loadingDid = true
                    that.genDidVideo(msg)
                } else {
                    that.textContext.push("不好意思，刚刚没听清楚，可以再说一遍吗？")
                    that.$notify.error({
                        title: 'gpt对话失败',
                        message: response.msg
                    });
                }

            })
            // }
        },

        //--------------------------------did------------------        
        genDidVideo(text) {
            var that = this
            genDidTalk(text).then(resp => {
                if (resp.code == 200) {
                    var msg = resp.msg
                    that.loadingDid = false
                    that.videoSrc = msg
                    const video = that.$refs.videoPlayer
                    that.currentSrcIndex = (that.currentSrcIndex + 1) % that.videoSrcs
                    that.lastFrame = video.currentTime
                    that.$refs.videoPlayer.load();
                    that.$refs.videoPlayer.play();
                } else {
                    that.$notify.error({
                        title: '虚拟人失败',
                        message: response.msg
                    });
                }

            })
        }

    },

}

</script>

<style>
.context {
    margin: 5px 0px 5px 0px;
    padding: 5px;
    font-size: 14px;
    border: #ececec solid 2px;
    border-radius: 5px;
    font-weight: normal;
    color: #000;
}

ul,
li {
    margin: 0;
    padding: 0;
    list-style: none;
}

.box-card {
    margin-top: 30px;
}

.record {
    text-align: center;
}

.recordBtn {
    border: none;
    font-size: 30px;

}


.item {
    padding: 18px 0;
}

.recText {
    /* margin: 20px; */
    margin-top: 20px;
    font-weight: bold;
    color: #448ef7;
}

.respText {
    margin: 15px;
    font-weight: bold;
    color: #448ef7;
}</style>
