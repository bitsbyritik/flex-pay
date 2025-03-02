import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check } from "lucide-react";

export const PaymentSuccess = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card className="w-96 bg-slate-200">
        <CardHeader className="text-center text-black font-extrabold text-3xl">
          <CardTitle>Flex Pay</CardTitle>
        </CardHeader>
        <CardContent className="text-black text-center my-8 gap-4 flex flex-col items-center">
          <Check className="text-green-800" strokeWidth={3} size={72} />
          <div className="text-2xl text-green-800 font-extrabold">
            Payment Completed!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
