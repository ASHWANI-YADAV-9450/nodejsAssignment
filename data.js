const user =require("./user.json")
const len =Object.keys(user).length
// console.log(user)

module.exports=()=>{
    const data={
        users:[]
    }
    for(let i=0; i<len; i++){
        console.log()
        data.users.push(user)
    }
    return data
}



        // To sort id in decending order
// http://localhost:3000/users?_sort=id&_order=desc


        // To find
// http://localhost:3000/users?lastname=sharma


        //To create limits
// http://localhost:3000/users?page=1&_limit=2


    // Used for filter or search
// http://localhost:3000/users?q=As


// npm run server-json