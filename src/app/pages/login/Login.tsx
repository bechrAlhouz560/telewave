import React, {
  BaseSyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { TelegramClientContext } from "../../App";
import { API_ID, API_HASH } from "../../../api/global";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
// @ts-ignore
import logo from "../../../assets/logo-main-white.svg";
import CodeInput from "../../components/common/CodeInput";
import { getActiveTheme } from "../../features/theme/themeSlice";
interface IInitialState {
  phoneNumber: string;
  password: string;
  phoneCode: string;
}

const initialState = { phoneNumber: "", password: "", phoneCode: "" }; // Initialize component initial state
export default function Login() {
  const { client } = useContext(TelegramClientContext);
  const isLoggedIn = useSelector(function (state: any) {
    return state.auth.loggedIn;
  });
  const theme = useSelector(getActiveTheme);
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveUser, setSaveUser] = useState(false);
  const [{ phoneNumber, password, phoneCode }, setAuthInfo] =
    useState<IInitialState>(initialState);
  const navigate = useNavigate();
  async function sendCodeHandler(): Promise<void> {
    setLoading(true);
    try {
      await client.connect();
      await client.sendCode(
        {
          apiId: API_ID,
          apiHash: API_HASH,
        },
        phoneNumber
      );

      setCodeSent(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function clientStartHandler(): Promise<void> {
    setLoading(true);
    try {
      await client.start({
        phoneNumber,
        password: userAuthParamCallback(password),
        phoneCode: userAuthParamCallback(phoneCode),
        onError: () => {},
      });
      await client.sendMessage("me", {
        message: "You're successfully logged in!",
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function inputChangeHandler({
    target: { name, value },
  }: BaseSyntheticEvent): void {
    setAuthInfo((authInfo: any) => ({ ...authInfo, [name]: value }));
  }

  function userAuthParamCallback<T>(param: T): () => Promise<T> {
    return async function () {
      return await new Promise<T>((resolve) => {
        resolve(param);
      });
    };
  }

  useEffect(function () {
    if (isLoggedIn) {
      navigate("/");
    }
  }, []);

  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url(https://random-image-pepebigotes.vercel.app/api/random-image)",
      }}
    >
      <div
        className="absolute opacity-75 inset-0 z-0"
        style={{
          background: theme.primary,
        }}
      ></div>
      <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
        <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
          <div className="self-center p-16 items-center hidden lg:flex flex-col text-white">
            <img src={logo} width={100} alt="Logo" className="mb-8" />
            <h1 className="mb-3 font-bold text-3xl">Welcome To Telewave !</h1>
            <p className="text-center opacity-70">
              Experience the ultimate Telegram app with Telewave! Sleek,
              stylish, and incredibly user-friendly—Telewave transforms your
              messaging into a vibrant, seamless adventure. Connect, chat, and
              explore like never before!
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-3xl w-100">
            <div className="mb-4">
              <h3
                className="font-semibold text-2xl "
                style={{ color: theme.primary }}
              >
                Sign In
              </h3>
              <p className="text-gray-400">Please sign in to your account.</p>
            </div>
            {codeSent ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Verification Code
                  </label>
                  <CodeInput
                    onComplete={function (code) {
                      // @ts-ignore
                      inputChangeHandler({
                        target: {
                          name: "phoneCode",
                          value: code,
                        },
                      });
                    }}
                    length={5}
                  />
                </div>
                {/* <div className="space-y-2">
                <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  className="w-full content-center text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  type="password"
                  placeholder="Enter your password"
                />
              </div> */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember_me"
                      name="remember_me"
                      type="checkbox"
                      className="h-4 w-4 bg-cyan focus:ring-blue-400 border-gray-300 rounded"
                      disabled={loading}
                      onChange={function (e) {
                        setSaveUser(e.currentTarget.checked);
                      }}
                      checked={saveUser}
                    />
                    <label
                      htmlFor="remember_me"
                      className="ml-2 block text-sm text-gray-500"
                    >
                      Keep me signed in
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={function () {
                      setCodeSent(false);
                    }}
                    className={
                      " items-center flex justify-center bg-gray-400  text-gray-100 w-14 h-14 hover:opacity-70 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in " +
                      (loading ? "opacity-70" : "")
                    }
                  >
                    <FiArrowLeft></FiArrowLeft>
                  </button>
                  <button
                    type="submit"
                    onClick={clientStartHandler}
                    disabled={loading}
                    className={
                      "flex-1 items-center flex justify-center  hover:opacity-60 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in " +
                      (loading ? "opacity-70" : "")
                    }
                    style={{
                      background: theme.primary,
                    }}
                  >
                    <span> Log in</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 tracking-wide">
                    Phone Number
                  </label>
                  <input
                    className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan"
                    type="tel"
                    placeholder="+123456789"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={inputChangeHandler}
                    disabled={loading}
                  />
                </div>
                {/* <div className="space-y-2">
                <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  className="w-full content-center text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  type="password"
                  placeholder="Enter your password"
                />
              </div> */}
                {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 bg-cyan focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-500"
                  >
                    Keep me signed in
                  </label>
                </div>
              </div> */}
                <div>
                  <button
                    onClick={sendCodeHandler}
                    disabled={loading}
                    type="submit"
                    className={
                      "w-full items-center flex justify-center  hover:opacity-70 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in " +
                      (loading ? "opacity-70" : "")
                    }
                    style={{
                      background: theme.primary,
                    }}
                  >
                    <span className="mr-2"> Send Code</span>{" "}
                    <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
            <div className="pt-5 text-center text-gray-400 text-xs">
              <span>All Right Reserved © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
