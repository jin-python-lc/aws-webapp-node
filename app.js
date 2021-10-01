var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan')
const passport = require('passport')
var mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session');
const nodemailer = require('nodemailer');



///////////////////////mongodb接続
const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true
}
mongoose.connect('mongodb://*****************/user', options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => console.log('DB connection successful!!!!'));



var Schema = mongoose.Schema;
var UserSchema = new Schema({
	onetimepass: String,
	id: String,
	name: String,
	email: String,
	password: String,
	payment: {
		default: 'false',
		type: String
	}
});
var UserModel = mongoose.model('users', UserSchema);
var User = mongoose.model('users');


//Routes and View
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);




/////////////////////////// セッション管理
app.use(session({
	secret: "secret key",
	resave: false,
	saveUninitialized: true
}));

app.get('/exam', (req, res) => {
	if (req.session.user) {
		User.findOne({
			email: req.session.user.email,
		}, function (err, result) {
			console.log(result)
			if (err) {
				//console.log(err)
				res.render('/login2',{info:''})
			} else if (result.payment == 'false') {
				res.redirect('/');
			} else {
				res.render('exam')
			}
		})
	} else {
		res.render('login2', { info: 'ログインと決済が必要です。' })
	}
});


//////////////////////登録
app.get('/register', (req, res) => {
	res.render('register');
});

var min = 100000 ;
var max = 999999 ;
var Pass = Math.floor( Math.random() * (max + 1 - min) ) + min ;

app.post('/register', async (req, res) => {
	User.findOne({
		email: req.body.email,
	}, function (err, result) {
		console.log(result)
		if (err) {
			console.log(err)
		} else if (result != null) {
			res.render('register')
		} else {
			res.render('login2', { info: '' });
			var user = new UserModel();
			user.onetimepass = Pass.toString();
			user.id = Date.now().toString();
			user.name = req.body.name;
			user.email = req.body.email;
			user.password = req.body.password;
			//user.save();
			user.save(function (err) {
				if (err) { console.log(err); }
			});
		}
	})
});



//////////////////////////////ログイン
app.get('/login', (req, res) => {
	User.findOne({
		email: req.session.user.email,
	}, function (err, result) {
		console.log(result)
		if (err) {
			console.log(err)
		} else if (result.payment == 'true') {
			var params = {
				name: req.session.user.name,
				content: '支払い確認済みです。模擬試験をご利用いただけます。'
			}
		} else {
			var params = {
				name: req.session.user.name,
				content: 'お支払いが確認できていません。サービス別基礎問題他、模擬試験以外のご利用は可能です。'
			}
		}
	res.render('login.ejs', params);
	console.log(params)
	})
});

app.get('/login2', (req, res) => {
	if (req.session.user) {
		res.redirect('/login')
	} else {
		res.render('login2', { info: '' })
	}
	res.render('login2.ejs', { info: '' });
});

app.post('/login2', async (req, res) => {
	User.findOne({
		email: req.body.email,
		password: req.body.password
	}, function (err, result) {
		//console.log(result)
		if (err) {
			console.log(err)
		} else if (result != null) {
			console.log(result.email)
			//res.sendFile(__dirname + '/private/logincheck.html')
			req.session.user = {
				name: result.name,
				email: req.body.email,
				password: req.body.password
			}
			res.redirect('/login')
		} else {
			console.log(result + '(else)')
			res.render('login2', { info: '認証できません。' });
		}
	})
});



////////////////////////パスワードリセット
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	//port: '465',
	secure: 'ssl',
	auth: {
	  user: '***********',
	  pass: '***********'
	}
});
  
app.get('/passreset', (req, res) => {
	res.render('passreset');
});

app.post('/resetpass', async (req, res) => {
	User.findOne({
		email: req.body.email,
	}, function (err, result) {
		//console.log(result)
		if (err) {
			console.log(err)
		} else if (result != null) {
			console.log(result.email)
			const data = {
				from: '**************@********',
				to: `${result.email}`,
				text: `${result.onetimepass}`,
				subject: 'ワンタイム認証パス',
			};
			transporter.sendMail(data, (error, info) => {
				if(error) {
				  console.log(error); 
				} else {
				  console.log(info);  // 送信したメールの情報
				}
			});
			res.render('resetpass')
		} else {
			console.log(result + '(else)')
			res.render('login2', { info: 'メールアドレスが見つかりませんでした。' });
		}
	})
});

app.get('/passpass', (req, res) => {
	res.render('passpass');
});

app.post('/renew', async (req, res) => {
	User.findOne({
		email: req.body.email,
		onetimepass: req.body.onetimepass
	}, function (err, result) {
		if (err) {
			//
		} else if (result != null) {
			console.log(req.body.password)
			UserModel.updateOne({ email: req.body.email }, { $set: { password: req.body.password} },function (err) {
				if (err) {
					res.send(err);
					console.log(err);
				}
			})
			res.render('login2',{info:''})
		} else {
			console.log(result + '(else)')
			res.render('login2', { info: '認証できません。' });
		}
	})
});
//////

////////////////////////決済
const stripe = require("stripe")('*******************')

const storeItems = new Map([
	[1, { priceInCents: 500, name: "AWS SAA 模擬試験(65問) 本番同等の難易度" }],
])

app.post("/create-checkout-session", async (req, res) => {
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: req.body.items.map(item => {
				const storeItem = storeItems.get(item.id)
				return {
					price_data: {
						currency: "jpy",
						product_data: {
							name: storeItem.name,
						},
						unit_amount: storeItem.priceInCents,
					},
					quantity: item.quantity,
				}
			}),
			//success_url: `http://localhost:3000/success.html?session_id={CHECKOUT_SESSION_ID}`,
			success_url: 'http://localhost:3000/checkout1122334455',
			cancel_url: 'http://localhost:3000/login',
		})
		res.json({ url: session.url })
	} catch (e) {
		res.status(500).json({ error: e.message })
	}
})

app.get('/checkout1122334455', async (req, res) => {
	if (req.session.user) {
		UserModel.updateOne({ email: `${req.session.user.email}` }, { $set: { payment: 'true' } }, { upsert: false }, function (err) {
			if (err) {
				res.send(err);
				console.log(err);
			}
		})
		res.redirect('login')
	} else {
		res.render('login2', { info: 'ログインしてください。' })
	}
});






/////////////////////////////////////認証が必要なページのルーティング
app.get('/exam.html', (req, res) => {
	if (req.session.user) {
		User.findOne({
			email: req.session.user.email,
		}, function (err, result) {
			console.log(result)
			if (err) {
				//console.log(err)
				res.render('/login2',{info:''})
			} else if (result.payment == 'false') {
				res.redirect('login')
			} else {
				res.sendFile(__dirname + '/private/exam.html');
			}
		})
	} else {
		res.render('login2', { info: 'ログインと決済が必要です。' })
	}
});
app.get('/description*.html', (req, res) => {
	if (req.session.user) {
		User.findOne({
			email: req.session.user.email,
		}, function (err, result) {
			console.log(result)
			if (err) {
				//console.log(err)
				res.render('/login2',{info:''})
			} else if (result.payment == 'false') {
				res.redirect('login')
			} else {
				res.sendFile(__dirname + `/private/${req.url}`);
			}
		})
	} else {
		res.render('login2', { info: 'ログインしてください。' })
	}
});
app.get('/*index.html', (req, res) => {
	if (req.session.user) {
		User.findOne({
			email: req.session.user.email,
		}, function (err, result) {
			console.log(result)
			if (err) {
				//console.log(err)
				res.render('/login2',{info:''})
			} else if (result.payment == 'false') {
				res.redirect('login')
			} else {
				res.sendFile(__dirname + `/private/${req.url}`);
			}
		})
	} else {
		res.render('login2', { info: 'ログインしてください。' })
	}
});
app.get('/result*.html', (req, res) => {
	if (req.session.user) {
		User.findOne({
			email: req.session.user.email,
		}, function (err, result) {
			console.log(result)
			if (err) {
				//console.log(err)
				res.render('/login2',{info:'ログインしてください。'})
			} else if (result.payment == 'false') {
				res.redirect('/');
			} else {
				res.sendFile(__dirname + `/private/${req.url}`);
			}
		})
	} else {
		res.render('login2', { info: 'ログインしてください。' })
	}
});







/////////////////////////////////////エラー処理
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
