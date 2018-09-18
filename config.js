module.exports = {
    port:3000,
    name:'李湘华博客',
    describe:'这是李湘华的个人网站',
    mongodb: 'mongodb://localhost:27017/myblog',
    dbInfo:{
        success:'数据库连接成功',
        error:'数据库连接失败'
    },
    pageSize:10,
    showPages:7,
    session:{
        secret:'myblog',
        name:'myblog',
        maxAge:1800000
    }
}