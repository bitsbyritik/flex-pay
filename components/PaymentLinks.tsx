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
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

  useEffect(() => {
    const fetchPaymentLinks = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/payment/link?walletAddress=${walletAddress}`,
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Payment Links</h2>
      {paymentLinks.length === 0 ? (
        <p>No payment links found.</p>
      ) : (
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Currency</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {paymentLinks.map((link) => (
              <tr key={link.id} className="border-b border-gray-700">
                <td className="p-3">{`${BASE_URL}/pay/${link.id}`}</td>
                <td className="p-3">{link.amount}</td>
                <td className="p-3">{link.status}</td>
                <td className="p-3">
                  {new Date(link.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
