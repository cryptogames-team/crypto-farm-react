import { h_postJson } from '../js/fetch';

// NFT 발행 코드
export async function MintNFT(template_id) {

  console.log(`MintNFT 호출`, template_id);
  
    try {
      const url = "http://221.148.25.234:8989/startTransaction";
      const data = {
        "datas": {
          "action_account": "eosio.nft",
          "action_name": "mintasset",
          "auth_name": "test4",
          "senderPrivateKey": "5KcnyZ5HGm1vB52t8fuFq8CnCkzWEonF6QT8Uc71D6KdiSMikRH",
          "data": {
            "authorized_minter": "test4",
            "collection_name": "cryptofarmss",
            "schema_name": "character",
            "template_id": template_id,
            "new_asset_owner": localStorage.getItem("account_name"),
            "mutable_data": "",
            "immutable_data": [],
            "tokens_to_back": []
          }
        }
      }
      const res = await h_postJson(url, data);

      return res;

      
      console.log(`NFT 발행 응답값 : `, res.result.transaction_id);
          
    } catch (error) {
      alert("NFT 발행 오류");    
    }
      
  }