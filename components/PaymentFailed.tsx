import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BadgeX } from "lucide-react";

export const PaymentFailed = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card className="w-96 bg-slate-200">
        <CardHeader className="text-center text-black font-extrabold text-3xl">
          <CardTitle>Flex Pay</CardTitle>
        </CardHeader>
        <CardContent className="text-black text-center my-8 gap-4 flex flex-col items-center">
          <BadgeX className="text-red-700" size={72} />
          <div className="text-2xl text-red-700 font-extrabold">
            Payment Failed!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
