const handleRegister = (req,res,db,bcrypt) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password){
        return res.status(400).json("Bad request!");
    }

    const hash = bcrypt.hashSync(password);
    //apro una transaction per registrare
    db.transaction(trx => {
        //provo a inserire hash & email dentro login
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            //recupero email inserita
            .returning('email')
            //se va tutto bene inserisco email dentro users
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0], //devo estrarre l'elemento perche mi restituisce un array
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            //se va tutto bene committo
            .then(trx.commit)
            //altrimenti annullo
            .catch(trx.rollback)
    })
        .catch(err => res.status(404).json('Unable to register'));
}

module.exports = {
    handleRegister: handleRegister
};