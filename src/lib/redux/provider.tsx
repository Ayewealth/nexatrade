"use client";

import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "@/components/global/loader";

type Props = {
  children: React.ReactNode;
};

export const ReduxProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="w-full h-dvh flex justify-center items-center">
            <Loader />
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};
