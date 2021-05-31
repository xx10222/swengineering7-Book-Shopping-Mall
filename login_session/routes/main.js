var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

// set mail //
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service : 'gmail',
  auth: {
    user:'testest10222@gmail.com',
    pass:'test1234!' //password
  }
});

var mailOption;

var mysql = require('mysql');
const { response } = require('express');
var pool = mysql.createPool({
  connectionLimit: 5,
  host:'localhost',
  user : 'root',
  password:'1234',
  database: 'sw_project'
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(session({
  secret:'!@#$%^&*',
  resave:false,
  saveUninitialized : true
}));



/* GET main page */
router.get('/', function(req, res, next) {
  res.render('main', { title: 'Main page', name:req.session.name}); //main.ejs

});

/* GET login page */
router.get('/login',function(req, res, next){
  res.render('login', {title:'login', name:req.session.name});
});

/* GET welcome page */
router.get('/welcome',function(req, res, next){
  if(!req.session.name) return res.redirect('/login');
  else res.render('welcome', {title:'welcome', name:req.session.name});
});

/* GET findid page */
router.get('/findid',function(req, res, next){
  res.render('findid', {title:'findid'});
});

/* GET findpwd page */
router.get('/findpwd',function(req, res, next){
  res.render('findpwd', {title:'findpwd'});
});

/* GET customer mypage 
router.get('/custpage',function(req, res, next){
  res.render('custpage', {title:'customer my page', name:req.session.name});
  if
})*/

/* POST login page */
router.post('/login', function(req,res,next){
  var division = req.body.division;
  var id=req.body.id;
  var passwd=req.body.passwd;
  
  pool.getConnection(function(err, connection){
    if(division=="customer")
    {
      var sql = 'SELECT * FROM customer WHERE cust_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        var user = rows[0];
        if(!user){
          res.send('<script type="text/javascript">alert("가입되지 않은 아이디입니다.");location.href="/login";</script>');
        }
        else if(user.cust_pwd != passwd)
        {
          res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다.");location.href="/login";</script>');
        }
        else 
        {
          req.session.name = user.cust_name;
          req.session.id = user.cust_id;
          console.log('session : ', JSON.stringify(req.session.name));
          req.session.save(function(){
            res.redirect('/welcome');
          })
        }
        connection.release();
      });
      
    }
    else if(division=="seller")
    {
      var sql = 'SELECT * FROM seller WHERE sell_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        var user = rows[0];
        if(!user){
          res.send('<script type="text/javascript">alert("가입되지 않은 아이디입니다.");location.href="/login";</script>');
        }
        else if(user.sell_pwd != passwd)
        {
          res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다.");location.href="/login";</script>');
        }
        else 
        {
          req.session.name = user.sell_name;
          req.session.id = user.sell_id;
          console.log('session : ', JSON.stringify(req.session.name));
          req.session.save(function(){
            res.redirect('/welcome');
          })
        }
        connection.release();
      });
    }
    else if(division=="manager")
    {
      var sql = 'SELECT * FROM employee WHERE emp_id=?';
      connection.query(sql, id, function(err,rows){
        if(err) console.error("err : "+err);
        console.log("rows : " + JSON.stringify(rows));
        var user = rows[0];
        if(!user){
          res.send('<script type="text/javascript">alert("가입되지 않은 아이디입니다.");location.href="/login";</script>');
        }
        else if(user.emp_pwd != passwd)
        {
          res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다.");location.href="/login";</script>');
        }
        else 
        {
          req.session.name = user.emp_name;
          req.session.id = user.emp_id;
          console.log('session : ', JSON.stringify(req.session.name));
          req.session.save(function(){
          res.redirect('/welcome');
          })
        }
        connection.release();
      });
    }
  });
});

// logout 처리
router.get('/logout', function(req,res,next){
	delete req.session.name;
	res.redirect('/');
});

/* POST findid page */
router.post('/findid', function(req,res,next){
  var division = req.body.division;
  var email=req.body.email;
  var name=req.body.name;
  var datas=[name, email];
  pool.getConnection(function(err, connection){
    if(division=="customer")
    {console.log('customer!');
      var sql = "SELECT cust_id FROM customer WHERE cust_name=? AND cust_email=?";
      connection.query(sql, datas, function(err,rows){
        if(err) console.error("err : "+err);
        if(rows[0]==null)
        {
            res.send('<script type="text/javascript">alert("가입되지 않은 아이디 혹은 이메일입니다!");location.href="/findid";</script>');
          connection.release();
        }
        else
        {
          console.log("rows : " + JSON.stringify(rows));
          var user = rows[0];
          console.log("cust_id : ", JSON.stringify(user.cust_id));
          var text = '<script type="text/javascript">alert("가입하신 아이디는 '+user.cust_id+'입니다.");location.href="/login";</script>';
          res.send(text);
          connection.release();
        }
      });
    }
    else if(division=="seller")
    {console.log('seller!');
      var sql = "SELECT sell_id FROM seller WHERE sell_name=? AND sell_email=?";
      connection.query(sql, datas, function(err,rows){
        if(err) console.error("err : "+err);
        if(rows[0]==null)
        {
            res.send('<script type="text/javascript">alert("가입되지 않은 아이디 혹은 이메일입니다!");location.href="/findid";</script>');
          connection.release();
        }
        else
        {
          console.log("rows : " + JSON.stringify(rows));
          var user = rows[0];
          console.log("cust_id : ", JSON.stringify(user.sell_id));
          var text = '<script type="text/javascript">alert("가입하신 아이디는 '+user.sell_id+'입니다.");location.href="/login";</script>';
          res.send(text);
          connection.release();
        }
      });
    }
    else if(division=="manager")
    {console.log('manager!');
      var sql = "SELECT emp_id FROM employee WHERE emp_name=? AND emp_email=?";
      connection.query(sql, datas, function(err,rows){
        if(err) console.error("err : "+err);
        if(rows[0]==null)
        {
            res.send('<script type="text/javascript">alert("관리자 가입되지 않은 아이디 혹은 이메일입니다!");location.href="/findid";</script>');
          connection.release();
        }
        else
        {
          console.log("rows : " + JSON.stringify(rows));
          var user = rows[0];
          console.log("cust_id : ", JSON.stringify(user.emp_id));
          var text = '<script type="text/javascript">alert("가입하신 아이디는 '+user.emp_id+'입니다.");location.href="/login";</script>';
          res.send(text);
          connection.release();
        }
      });
    }
  });
});

/* POST findpwd page */
router.post('/findpwd', function(req,res,next){
  var division = req.body.division;
  var id = req.body.id;
  var email=req.body.email;
  var name=req.body.name;
  var datas=[id, name, email];
  
  pool.getConnection(function(err, connection){
    if(division=="customer")
    {console.log('customer!');
      var sql = "SELECT * FROM customer WHERE cust_id=?";
      connection.query(sql, datas, function(err,rows){
        if(err) console.error("err : "+err);
        if(rows[0]==null)
        {
            res.send('<script type="text/javascript">alert("회원정보가 존재하지 않습니다!");location.href="/findpwd";</script>');
            connection.release();
        }
        else
        {
          console.log("rows : " + JSON.stringify(rows));
          const randomString = Math.random().toString(36).slice(2);
          var user = rows[0];
          if(email != user.cust_email || name != user.cust_name) //아이디와 이메일 혹은 이름이 일치하지 않는 경우
          {
            res.send('<script type="text/javascript">alert("아이디와 회원정보가 일치하지 않습니다!");location.href="/findpwd";</script>');
            connection.release();
          }
          else //회원정보 모두 일치
          {
            datas=[randomString, id];
            sql="UPDATE customer SET cust_pwd = ? WHERE cust_id=?";
            connection.query(sql,datas, function(err,rows){
              if(err) console.error("err : "+ err);
              else console.log("success to change temporary password");
            })
            mailOption = {
              from:'testest10222@gmail.com',
              to: user.cust_email,
              subject: '임시 비밀번호입니다',
              text: '임시 비밀번호는 '+randomString+' 입니다.'
            };
            transporter.sendMail(mailOption, function(err,res){
              if(err) console.log(err);
              else console.log('이메일 발송 성공');
              transporter.close();
            });
            res.send('<script type="text/javascript">alert("가입하신 이메일로 임시 비밀번호를 전송하였습니다.반드시 변경하시길 바랍니다.");location.href="/login";</script>');
            connection.release();
          }
          
        }
      });
    }
    else if(division=="seller")
    {console.log('seller!');
      var sql = "SELECT * FROM seller WHERE sell_id=?";
      connection.query(sql, datas, function(err,rows){
      if(err) console.error("err : "+err);
      if(rows[0]==null)
      {
          res.send('<script type="text/javascript">alert("회원정보가 존재하지 않습니다!");location.href="/findpwd";</script>');
          connection.release();
      }
      else
      {
        console.log("rows : " + JSON.stringify(rows));
        const randomString = Math.random().toString(36).slice(2);
        var user = rows[0];
        if(email != user.sell_email || name != user.sell_name) //아이디와 이메일 혹은 이름이 일치하지 않는 경우
        {
          res.send('<script type="text/javascript">alert("아이디와 회원정보가 일치하지 않습니다!");location.href="/findpwd";</script>');
          connection.release();
        }
        else //회원정보 모두 일치
        {
          datas=[randomString, id];
          sql="UPDATE seller SET sell_pwd = ? WHERE sell_id=?";
          connection.query(sql,datas, function(err,rows){
            if(err) console.error("err : "+ err);
            else console.log("success to change temporary password");
          })
          mailOption = {
            from:'testest10222@gmail.com',
            to: user.cust_email,
            subject: '임시 비밀번호입니다',
            text: '임시 비밀번호는 '+randomString+' 입니다.'
          };
          transporter.sendMail(mailOption, function(err,res){
            if(err) console.log(err);
            else console.log('이메일 발송 성공');
            transporter.close();
          });
          res.send('<script type="text/javascript">alert("가입하신 이메일로 임시 비밀번호를 전송하였습니다.반드시 변경하시길 바랍니다.");location.href="/login";</script>');
          connection.release();
        }
      }
    });
      
    }
    else if(division=="manager")
    {console.log('manager!');
    var sql = "SELECT * FROM employee WHERE emp_id=?";
    connection.query(sql, datas, function(err,rows){
      if(err) console.error("err : "+err);
      if(rows[0]==null)
      {
          res.send('<script type="text/javascript">alert("회원정보가 존재하지 않습니다!");location.href="/findpwd";</script>');
          connection.release();
      }
      else
      {
        console.log("rows : " + JSON.stringify(rows));
        const randomString = Math.random().toString(36).slice(2);
        var user = rows[0];
        if(email != user.emp_email || name != user.emp_name) //아이디와 이메일 혹은 이름이 일치하지 않는 경우
        {
          res.send('<script type="text/javascript">alert("아이디와 회원정보가 일치하지 않습니다!");location.href="/findpwd";</script>');
          connection.release();
        }
        else //회원정보 모두 일치
        {
          datas=[randomString, id];
          sql="UPDATE employee SET emp_pwd = ? WHERE emp_id=?";
          connection.query(sql,datas, function(err,rows){
            if(err) console.error("err : "+ err);
            else console.log("success to change temporary password");
          })
          mailOption = {
            from:'testest10222@gmail.com',
            to: user.cust_email,
            subject: '임시 비밀번호입니다',
            text: '임시 비밀번호는 '+randomString+' 입니다.'
          };
          transporter.sendMail(mailOption, function(err,res){
            if(err) console.log(err);
            else console.log('이메일 발송 성공');
            transporter.close();
          });
          res.send('<script type="text/javascript">alert("가입하신 이메일로 임시 비밀번호를 전송하였습니다.반드시 변경하시길 바랍니다.");location.href="/login";</script>');
          connection.release();
        }
      }
    });
    }
  });
});



module.exports = router;
