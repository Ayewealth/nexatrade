"use client";

import React, { useEffect } from "react";
import Investment from "../_components/invest";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getPackages, getSubscriptions } from "@/actions/auth";
import {
  setPackages,
  setSubscriptions,
} from "@/lib/redux/slice/investmentSlice";

const Page = () => {
  const dispatch = useDispatch();

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: getPackages,
    refetchInterval: 5000,
  });

  const { data: subscriptions, isLoading: subscriptionsLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (packages) {
      const parsedPackages = packages.map((pkg) => ({
        ...pkg,
        features:
          typeof pkg.features === "string"
            ? JSON.parse(pkg.features)
            : pkg.features,
      }));

      dispatch(setPackages({ packageData: parsedPackages }));
    }
    if (subscriptions) {
      dispatch(setSubscriptions({ subscriptionData: subscriptions }));
    }
  }, [packages, subscriptions, dispatch]);

  if (packagesLoading || subscriptionsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Investment />
    </div>
  );
};

export default Page;
