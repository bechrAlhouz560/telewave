import React, {
  BaseSyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_HASH, API_ID } from "../../../api/global";
import { TelegramClientContext } from "src/app/App";
interface IInitialState {
  phoneNumber: string;
  password: string;
  phoneCode: string;
}
const initialState: IInitialState = {
  phoneNumber: "",
  password: "",
  phoneCode: "",
}; // Initialize component initial state
export default function Button() {
  const client = useContext(TelegramClientContext);
  const [{ phoneNumber, password, phoneCode }, setAuthInfo] =
    useState<IInitialState>(initialState);

  async function sendCodeHandler(): Promise<void> {
    await client.connect(); // Connecting to the server
    await client.sendCode(
      {
        apiId: API_ID,
        apiHash: API_HASH,
      },
      phoneNumber
    );
  }

  async function clientStartHandler(): Promise<void> {
    await client.start({
      phoneNumber,
      password: userAuthParamCallback(password),
      phoneCode: userAuthParamCallback(phoneCode),
      onError: () => {},
    });
    await client.sendMessage("me", {
      message: "You're successfully logged in!",
    });
  }

  function inputChangeHandler({
    target: { name, value },
  }: BaseSyntheticEvent): void {
    setAuthInfo((authInfo) => ({ ...authInfo, [name]: value }));
  }

  function userAuthParamCallback<T>(param: T): () => Promise<T> {
    return async function () {
      return await new Promise<T>((resolve) => {
        resolve(param);
      });
    };
  }

  useEffect(function () {
    client.connect().then(async function () {
      const result = await client.invoke(
        new telegram.Api.messages.SendMessage({
          peer: "bechrbot",
          message: "Hello!",
          // @ts-ignore
          randomId: BigInt("-4156887774865"),
          noWebpage: true,
          noforwards: true,
          scheduleDate: 43,
        })
      );
      console.log(result.toJSON()); // prints the result
    });
  }, []);

  return (
    <>
      <input
        type="text"
        name="phoneNumber"
        value={phoneNumber}
        onChange={inputChangeHandler}
      />

      <input
        type="text"
        name="password"
        value={password}
        onChange={inputChangeHandler}
      />

      <input type="button" value="start client" onClick={sendCodeHandler} />

      <input
        type="text"
        name="phoneCode"
        value={phoneCode}
        onChange={inputChangeHandler}
      />

      <input type="button" value="insert code" onClick={clientStartHandler} />
    </>
  );
}
