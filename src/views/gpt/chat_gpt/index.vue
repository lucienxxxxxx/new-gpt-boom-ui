<template>
    <div class="app-container" style="height: 650px; background:  #f6f6f6;">
        <el-container>
            <el-row :gutter="24">
                <el-col :span="16">
                    <div class="grid-content bg-purple" style="margin-left: 20px;">

                        <el-card class="box-card" style="width: 700px;">
                            <!-- 视频区域 -->
                            <video width="600px">
                                
                            </video>
                        </el-card>

                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <!-- 消息面板区域 -->
                        <el-card class="box-card" style="width: 400px;">
                            <!-- 录制 -->
                            <div class="record">
                                <el-button @click="startRecording" v-model="iconBtn" class="recordBtn"
                                    style="width: 80px; height: 80px;" type="primary" icon="el-icon-microphone"
                                    circle></el-button>
                            </div>

                        </el-card>
                        <el-card class="box-card" style="width: 400px;">
                            <!-- 视频区域 -->
                            <div class="text">
                                这里是你的录音
                            </div>

                        </el-card>

                    </div>
                </el-col>
            </el-row>
        </el-container>

    </div>
</template>

<script>

export default {
    name: "aiInterview",
    data() {
        return {
            iconBtn: 'el-icon-microphone'
        }
    },
    methods: {
        startRecording() {
            console.log("开始录制")
        }
    }
}
</script>

<style>

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

.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}</style>
