import db from "./ramdb";

export const getRec = async (entName, rowKey, missingError=true)=>db(entName).then(t=>t.rows(rowKey, missingError));
export const getValue = async (entNane, rowKey, colName, missingError=true)=>getRec(entNane, rowKey, missingError).then(t=>t?.(colName));

export const getUser = async (accountKey, missingError=true)=>getRec("sysUsers", accountKey, missingError);