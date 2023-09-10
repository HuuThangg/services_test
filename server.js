const express = require("express");
const server = express();
const db = require("./mongoDB");
const port = 8080;
server.use(express.static('public')); // Tham chiếu đến thư mục images;

server.get("/dsTivi", (req, res) => {
    db.getAll("tivi").then(result => {
        res.json(result);
    })
})

server.get("/dsTivi/:id", (req, res) => {
    let filter = {
        "Ma_so": req.params.id
    }
    db.getOne("tivi", filter).then(result => {
        res.json(result)
    })

})

server.get("/dsDienthoai", (req, res) => {
    db.getAll("mobile").then(result => {
        res.json(result);
    })
})

server.get("/dsNguoidung", (req, res) => {
    db.getAll("user").then(result => {
        res.json(result);
    })
})
// Post
server.post("/insertUser", (req, res) => {
    let noi_dung_nhan = ``;
    req.on("data", (dulieu) => {
        noi_dung_nhan += dulieu;
    })
    req.on("end", () => {
        let user = JSON.parse(noi_dung_nhan);
        let ket_qua = {
            noi_dung: true
        }
        db.insertOne("user", user).then(result => {
            console.log(result);
            res.json(ket_qua)
        }).catch(err => {
            console.log(err);
            ket_qua.noi_dung = false;
            res.json(ket_qua);
        })
    })
})
server.post("/FindUser", (req, res) => {
    let noi_dung_nhan = ``
    let ket_qua = {
        noi_dung: true
    }
    req.on("data", (dulieu) => {
        noi_dung_nhan += dulieu;
    })
    req.on("end", () => {
        let user = JSON.parse(noi_dung_nhan);
        let filter = {
            "tendangnhap": user.tendangnhap,
            "pass": user.pass
        }

        db.getOne("user", filter).then(result => {
            try {
                if (result.tendangnhap == user.tendangnhap);
                res.json({
                    ket_qua: true,
                    tendangnhap: result.tendangnhap,
                    pass: result.pass,
                    hoten: result.hoten,
                    sdt: result.sodt
                })
            } catch {
                console.log("không tìm thấy")
                res.json({ ket_qua: false, noi_dung: "không tìm thấy tài khoản" })
            }

            // if (result.tendangnhap != null) {
            //     ket_qua.noi_dung = true;
            //     res.json(ket_qua)
            // }
            //else {
            //     res.json(ket_qua)
            //     //ket_qua.noi_dung_nhan;
            // }


        }).catch(err => {
            console.log(err);
            ket_qua.noi_dung = false;
            //res.json(ket_qua);
        })
    })
})

server.post("/updateUser", (req, res) => {
    let noi_dung_nhan = ``
    let ket_qua = {
        noi_dung: true
    }
    req.on("data", (dulieu) => {
        noi_dung_nhan += dulieu;

    })

    req.on("end", () => {
        let user = JSON.parse(noi_dung_nhan);
        let filter = {
            "Ma_so": user.Ma_so
        }
        let userUpdate = {
            "$set": {
                "Ho_ten": user.Ho_ten
            }
        }
        db.updateOne("user", filter, userUpdate).then(result => {
            console.log(result);
            res.json(ket_qua);
        }).catch(err => {
            console.log(err);
            ket_qua.noi_dung = false;
            res.json(ket_qua);
        })
    })
})
server.post("/deleteUser", (req, res) => {
    let noi_dung_nhan = ``;
    let ket_qua = {
        noi_dung: true
    }
    req.on("data", (dulieu) => {
        noi_dung_nhan += dulieu
    })
    req.on("end", () => {
        let user = JSON.parse(noi_dung_nhan);
        let filter = {
            "Ma_so": user.Ma_so
        }
        db.deleteOne("user", filter).then(result => {
            console.log(result);
            res.json(ket_qua);
        }).catch(err => {
            console.log(err);
            ket_qua.noi_dung = false;
            res.json(ket_qua);
        })
    })

})

const service = server.listen(port, () => {
    let host = service.address().address;
    console.log(`Services run ${host}:${port}`);
})



