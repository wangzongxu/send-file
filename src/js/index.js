var upload = {
    data:{
      fileList:[]//选择的文件
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
    },
    sendFile:function(file){
        var form = new FormData();
        form.append('fileName',file);
        var xhr=new XMLHttpRequest();
        xhr.open('post','/fileUpload',true);
        xhr.onreadystatechange=function(){
          if(this.readyState==4 && this.status==200){
            var res=xhr.responseText;
            console.log(res)
          }
        }
        xhr.upload.addEventListener('progress',function(e){
          console.log((e.loaded/e.total*100).toFixed(2)+'%')
        })
        xhr.send(form)
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
