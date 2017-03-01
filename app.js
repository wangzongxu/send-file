var express=require('express')
var app=express();
var path=require('path');
var fs=require('fs');
var formidable=require('formidable');

app.get('/',function(req,res){
  console.log('收到访问请求:',req.headers.host)
  res.sendFile(path.resolve('./src/index.html'));
})

app.use(express.static(path.join(__dirname,'./src/')));

app.post('/fileUpload',function(req,res){
  var form=new formidable.IncomingForm();
  form.parse(req,function(err,fileIds,files){
    if(err){
      console.log(err);
      let data={
        code:500,
        msg:'接收失败'
      }
      res.end(JSON.stringify(data));
      return
    }
    let rs=fs.createReadStream(files.fileName.path);
    let ws=fs.createWriteStream('./src/files/'+files.fileName.name);
    rs.pipe(ws);//pipe居然是同步的
    console.log('收到文件:',files.fileName.name)
    let data={
       code:200,
       msg:'发送成功'
     }
    res.setHeader('Content-type','application/json');
    res.end(JSON.stringify(data))
  })
});

app.listen(8080,function(){
  console.log('正在监听8080端口...')
})
