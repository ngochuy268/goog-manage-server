const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));

app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
const jwt = require('jsonwebtoken');

app.use(cors({
    origin: ['http://localhost:3000','https://good-management-client.vercel.app'], 
    methods: 'GET, POST', 
    allowedHeaders: 'Content-Type, Authorization', 
}));


const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 5,
    waitForConnections: true,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

db.getConnection((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});


//----------------------------------SIGN UP--------------------------------------------------------
app.post('/insert-nhanvien', async (req, res) => {
    const { id, name, password, gender, phone, email, address, avatar, birthday } = req.body;
    
    if (!id || !name || !password || !gender || !phone || !email || !address || !birthday) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ!' });
    }
    
    try {
        const result = await db.getConnection(`
            INSERT INTO nhanvien (id, name, password, gender, phone, email, address, avatar, birthday)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, name, password, gender, phone, email, address, avatar, birthday]);

        if (result) {
            res.json({ success: true, message: 'Thêm nhân viên thành công!' });
        } else {
            res.status(500).json({ success: false, message: 'Không thể thêm nhân viên vào cơ sở dữ liệu!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
});


// ---------------------------------CHECK PASSWORD AND ID LOGIN-----------------------------------------------

app.post('/login', (req, res) => {
    const { id, password } = req.body;

    const sql = 'SELECT password FROM nhanvien WHERE id = ?';
    db.getConnection(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Có lỗi xảy ra' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'ID không tồn tại' });
        }
        const storedPassword = results[0].password;

        if (password === storedPassword) {
            const token = jwt.sign({ id: id }, 'secret-key', { expiresIn: '1h' });

            delete password;

            return res.status(200).json({
                success: true,
                message: 'Đăng nhập thành công',
                token,
                userId: id
            });
        } else {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }
    });
});

//----------------------------- GET personal information-------------------------------
app.get('/get-nhanvien/:id', async (req, res) => {
    const { id } = req.params;
    try {
        db.getConnection(`
            SELECT id, name, gender, phone, email, address, avatar, birthday
            FROM nhanvien
            WHERE id = ?
        `, [id], (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu'
                });
            }

            if (results.length > 0) {
                res.json({
                    success: true,
                    user: results[0] 
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên!'
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra, vui lòng thử lại!'
        });
    }
});

//--------------------------------UPDATE AVATAR-------------------------------------------

app.put('/update-avatar/:id', (req, res) => {
    const { id } = req.params;
    const { avatar } = req.body;

    const sql = 'SELECT * FROM nhanvien WHERE id = ?';
    db.getConnection(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'データベースのクエリ中にエラーが発生しました' 
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'IDが存在しません' 
            });
        }

        const updateSql = 'UPDATE nhanvien SET avatar = ? WHERE id = ?';
        db.getConnection(updateSql, [avatar, id], (updateErr, updateResults) => {
            if (updateErr) {
                return res.status(500).json({ 
                    success: false,  
                    message: 'アバターの更新中にエラーが発生しました' 
                });
            }
            return res.status(200).json({ 
                success: true, 
                message: 'アバターが正常に更新されました' 
            });
        });
    });
});


//---------------------------------CHANGE PASSWORD-------------------------------------------

app.post('/change-password', (req, res) => {
    const { id, password } = req.body;

    const sql = 'SELECT * FROM nhanvien WHERE id = ?';
    db.getConnection(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'ID không tồn tại' });
        }

        const updateSql = 'UPDATE nhanvien SET password = ? WHERE id = ?';
        db.getConnection(updateSql, [password, id], (updateErr, updateResults) => {
            if (updateErr) {
                return res.status(500).json({ success: false,  error: 'Có lỗi xảy ra khi cập nhật mật khẩu' });
            }
            return res.status(200).json({ success: true, message: 'Mật khẩu đã được thay đổi thành công' });
        });
    });
});


// ---------------------------------OTP EMAIL-----------------------------------------------

let otpStore = {}; 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'popvibes.net@gmail.com', 
        pass: 'gejl hpdl ergo qsdx', 
    },
});

app.post('/send-otp', async (req, res) => {
    const { email, id } = req.body;

    const sql = 'SELECT * FROM nhanvien WHERE id = ? AND email = ?';
    db.getConnection(sql, [id, email], async (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi truy vấn cơ sở dữ liệu' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'ID không tồn tại trong hệ thống' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        otpStore[email] = otp; 
        try {
            await transporter.sendMail({
                from: '"Your App" <popvibes.net@gmail.com>',
                to: email,
                subject: 'Your OTP Code',
                text: `Your OTP code is: ${otp}`,
            });

            res.status(200).json({ success: true, message: 'OTP đã được gửi đến email của bạn!' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Không thể gửi OTP, vui lòng thử lại!' });
        }
    });
});

app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] === otp) {
        delete otpStore[email]; 
        res.status(200).json({ success: true, message: 'OTP verified successfully!' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid OTP!' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));




//---------------------------------INSERT GOODS-----------------------------------------------
app.post('/insert-good', async (req, res) => {
    const { id, name, cost, sell, quantity, image, status } = req.body;

    if(!id || !name || !cost || !sell || !quantity || !image || !status) {
        return res.status(400).json({ success: false, message: '無効なデータ!' });
    }

    try {
        
        const result = await db.getConnection(`
            INSERT INTO sanpham (idgood, namegood, sell, purchase, image, quantity, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [id, name, sell, cost, image, quantity, status]);
        
        if (result) {
            res.json({ success: true, message: '製品が正常に追加されました!' });
        } else {
            res.status(500).json({ success: false, message: '製品をデータベースに追加できません!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'エラーが発生しました。もう一度お試しください。' });
    }
})  

//---------------------------------GET GOODS-----------------------------------------------
app.get('/get-goods', (req, res) => {
    db.getConnection('SELECT * FROM sanpham', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'データの取得中にエラーが発生しました。' });
        }
        res.json({ success: true, data: rows });
    });
});

//---------------------------------UPDATE GOODS-----------------------------------------------
app.put('/update-good', (req, res) => {
    const { idgood, namegood, sell, purchase, status } = req.body;
    
    
    const query = `
        UPDATE sanpham 
        SET namegood = ?, sell = ?, purchase = ?, status = ?
        WHERE idgood = ?
    `;
    
    db.getConnection(query, [namegood, sell, purchase, status, idgood], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ 
                success: false, 
                message: '商品情報の更新中にエラーが発生しました。' 
            });
        }
        
        if (result) {
            res.json({ success: true, message: '商品情報を更新しました。' });
        } else {
            res.status(404).json({ 
                success: false, 
                message: '商品が見つかりませんでした。' 
            });
        }
    });
});

//---------------------------------DELETE GOODS-----------------------------------------------
app.delete('/delete-good/:id', (req, res) => {
    const goodId = req.params.id;
    
    const query = 'DELETE FROM sanpham WHERE idgood = ?';
    
    db.getConnection(query, [goodId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ 
                success: false, 
                message: '商品の削除中にエラーが発生しました。' 
            });
        }
        
        if (result) {
            res.json({ 
                success: true, 
                message: '商品を削除しました。' 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: '商品が見つかりませんでした。' 
            });
        }
    });
});

