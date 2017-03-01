var upload = {
    data:{
      fileList:[],//选择的文件
      count:0//发送中的数量
    },
    init: function(){
        this.eventListener()
    },
    eventListener: function(){
        $('input[name=single_upload_file]').on('change', function(e) {//文件选择
            upload.data.fileList = this.files;
        })
        $('input[name=single_upload_submit]').on('click', function(){ //上传按钮
            if(upload.data.fileList.length==0){
              alert('请选择文件');
              return
            }
            for(var i=0;i<upload.data.fileList.length;i++){
                var curFile=upload.data.fileList[i];
                upload.sendFile(curFile);
            }
            $('input[name=single_upload_file]')[0].value='';
        })
        $('.glyphicon.glyphicon-trash').on('click',function(){
          if( upload.data.count>0){
            var sure=alert('还有未完成任务');
              return
          }
          $('.fileList')[0].innerHTML=''
        })
    },
    sendFile:function(file){
        var fileName=null;
        if(/\s+/.test(file.name)){//存在空格的名字
          fileName=file.name.replace(/\s+/g,'').split('.')
        }else{
          fileName=file.name.split('.');
        }
        if(fileName.length>1){//文件有可能没有后缀，则不处理
          fileName=fileName[0]
        }
        var form = new FormData();
        form.append('fileName',file);
        upload.data.count++;
        this.insertContent(fileName,file);

        var xhr=new XMLHttpRequest();
        xhr.open('post','/fileUpload',true);
        xhr.onreadystatechange=function(){
          if(this.readyState!=4)return;
          if(this.status==200){
            var res=JSON.parse(xhr.responseText);
            if(res.code!=200){
                text.innerHTML+=' 发送出错'
                upload.changeProgressState(fileName,'danger')
            }
          }else{
            text.innerHTML+=' 发送出错'
            upload.changeProgressState(fileName,'danger')
          }
        }
        xhr.upload.addEventListener('progress',function(e){
          var progress=$('.'+fileName)[0];
          var text=$('.'+fileName+'>span')[0];
          var loaded=parseInt(e.loaded/e.total*100);
          progress.style.width=loaded+'%';
          text.innerHTML=loaded+'%  '+file.name;
          if(loaded>=100){
             upload.changeProgressState(fileName,'success');
             upload.data.count--;
          }
        })
        xhr.send(form);
    },
    insertContent:function(fileName,file){
      var fileList=$('.fileList')[0];
      var str='<div class="progress">\
                 <div class="progress-bar progress-bar-striped active '+fileName+'" style="width: 0">\
                   <span>0% '+file.name+'</span>\
                 </div>\
               </div>';
     fileList.innerHTML+=str
   },
   changeProgressState:function(fileName,type){
     var progress=$('.'+fileName)[0];
     progress.classList.remove(fileName);//删除类名，防止发送相同文件名称时操作混乱
     progress.classList.remove('active');//取消动画
     progress.classList.add('progress-bar-'+type);//更改状态
     progress.classList.remove('progress-bar');//删除初始状态
   }
}
window.addEventListener('DOMContentLoaded',function(){
   this.$=document.querySelectorAll.bind(document)
   NodeList.prototype.on=function(type,fn){
      for(var i=0;i<this.length;i++){
        var ele=this[i];
        ele.addEventListener(type,fn,false)
      }
   }
   upload.init()
})
// <div class="progress">
//     <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%">
//         <span>45%</span>
//     </div>
// </div>
