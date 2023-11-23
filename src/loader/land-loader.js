export function landLoader({params}) {

    // asset id를 가지고 여러가지 작업을 해줄 수 있다.
    console.log(`assetId : ${params.assetId}`);

    return params.assetId;    
}