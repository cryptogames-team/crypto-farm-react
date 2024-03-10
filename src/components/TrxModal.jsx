import React from 'react'
import { GiCancel } from "react-icons/gi";
import {
  AiOutlineCheckCircle,
} from "react-icons/ai";
  
export default function TrxModal({ isTrxModalOpen, closeModal, trxIds }) {
    if (!isTrxModalOpen) return null;

    console.log(`trxId`, trxIds);

    return (
        <div className="absolute top-60 -translate-x-1/2 left-1/2 z-20 rounded-lg bg-white border-2 w-[700px] h-[380px] p-5 shadow-xl">
            <div className="flex flex-col h-full">
                <button className='self-end' onClick={closeModal}><GiCancel size={30} /></button>
                <div className='mt-2 h-full'>
                    <div className="w-full h-full font-bold flex flex-col items-center">
                        <AiOutlineCheckCircle className="text-lime-500" size={80} />
                        <div className="mt-2 text-4xl">Buy Success!</div>
                        <div className="mt-5 text-xl">Cryptofarm's nft character purchase has been completed.</div>
                        <div className="mt-7 text-xl">
                            Trx ID (1) : {" "}
                            <a
                                className=" text-orange-500 font-bold"
                                href={`http://cryptoexplorer.store/Transaction/${trxIds[0]}`}
                                target="_blank"
                            >
                                {short_trx_id(trxIds[0])}
                            </a>
                        </div>
                        <div className="mt-2 text-xl">
                            Trx ID (2) : {" "}
                            <a
                                className=" text-orange-500 font-bold"
                                href={`http://cryptoexplorer.store/Transaction/${trxIds[1]}`}
                                target="_blank"
                            >
                                {short_trx_id(trxIds[1])}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}


function short_trx_id(keyString) {
    console.log(`keyString : ${keyString}`);
    const maxLength = 15; // 원하는 최대 길이
  
    if (keyString.length <= maxLength) {
      return keyString;
    }
  
    const shortenedKey = `${keyString.substring(
      0,
      maxLength / 2
    )}...${keyString.substring(keyString.length - maxLength / 2)}`;
    return shortenedKey;
  }