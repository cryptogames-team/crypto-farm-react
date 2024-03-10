import { h_postJson } from '../js/fetch';

// 계정 정보 조회 코드
export async function ReadAccount(account_name) {

    console.log(`ReadAccount 호출`, account_name);

    try {
        const url = "http://221.148.25.234:8989/getAccountInfo";
        const data = {
            "accountName": account_name
        }
        const res = await h_postJson(url, data);


        

        const dataString = res.account.core_liquid_balance;
        const result = dataString.replace(/\..*/, '') + ' HEP';
        console.log(`dataString`, result);

        if (result) {
            return result;
        } else {
            throw new Error("일치하는 패턴을 찾을 수 없습니다.");
        }
        

    } catch (error) {
        console.log("계정 정보 조회 오류 ", error);
        alert("계정 정보 조회 오류");
    }

}