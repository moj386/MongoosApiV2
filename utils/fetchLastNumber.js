
Masters = require('../app/Model/ModelMasters');
Counter = Masters.Increment;

const fetch = async (tableId) => {
   
   try{
    var ret = await Counter.findOneAndUpdate({ _id: tableId },{ $inc: { seq: 1 }}, {new: true});
    
    if(ret)
    return ret.seq;
    return 100
   } catch(e){

   }
   
   
}
module.exports = fetch