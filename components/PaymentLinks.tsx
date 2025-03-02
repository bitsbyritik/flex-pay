"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const PaymentLinksTable = ({
  walletAddress,
}: {
  walletAddress: string;
}) => {
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentLinks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/payment-links?walletAddress=${walletAddress}`,
        );
        setPaymentLinks(data);
      } catch (err) {
        console.error("Failed to fetch Payment links", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentLinks();
  }, [walletAddress]);

  return <div>PaymentLinks</div>;
};
