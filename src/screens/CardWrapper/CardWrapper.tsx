"use client";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  headerlabel: string;
  cardDescription: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerlabel,
  showSocial,
  cardDescription,
}: CardWrapperProps) => {
  return (
    <Card className="w-96">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{headerlabel}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      {children}
      <CardContent>
        {showSocial === false ? (
          <></>
        ) : (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline">
                {/* <Icons.gitHub className="mr-2 h-4 w-4" /> */}
                Github
              </Button>
              <Button variant="outline">
                {/* <Icons.google className="mr-2 h-4 w-4" /> */}
                Google
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
