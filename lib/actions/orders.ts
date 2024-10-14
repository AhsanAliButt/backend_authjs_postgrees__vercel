"use server";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { getSignedURL } from "../s3";
import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require("../../service_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const CreateOrder = async (
  price: number,
  quantity: number,
  message: string,
  productId: string,
  userId: string,
  sellerId: string,
  fullName: string,
  address: string,
  city: string,
  country: any,
  phone: any
) => {
  // return shippingdata
  try {
    const orderId = uuidv4().toString();
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product || product.stock < quantity) {
      return {
        message: `Your Required Quantity is not available`,
        status: 400,
      };
    }
    if (product) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          stock: product.stock - quantity,
          updatedAt: new Date(),
        },
      });
      const user = await prisma.user.findFirst({
        where: { id: userId },
      });
      const seller = await prisma.user.findFirst({
        where: { id: sellerId },
      });

      // Check for existing shipping address
      let shipping = await prisma.shipping.findFirst({
        where: { userId: userId },
      });

      if (!shipping) {
        // Create a new shipping address if not exists
        shipping = await prisma.shipping.create({
          data: {
            name: fullName,
            address: address,
            city: city,
            country: country,
            phone: phone,
            userId: userId,
          },
        });
      } else {
        // Update existing shipping address
        shipping = await prisma.shipping.update({
          where: { id: shipping.id },
          data: {
            name: fullName,
            address: address,
            city: city,
            country: country,
            phone: phone,
          },
        });
      }

      const newOrder = await prisma.orderSchema.create({
        data: {
          userId: userId,
          productId: productId,
          orderId: orderId,
          purchasedAt: new Date(),
          quantity: quantity,
          price: price,
          message: message,
          status: "Processing", // Setting the default status to Processing
          sellerId: sellerId,
        },
      });

      if (newOrder) {
        const existinginbox = await prisma.inbox.findFirst({
          where: {
            participant: {
              hasEvery: [String(userId), String(sellerId)],
            },
          },
        });

        if (!existinginbox) {
          await prisma.inbox.create({
            data: {
              participant: [userId, sellerId],
              lastmessage: {},
              chatroomname: `${userId}-${sellerId}`,
            },
          });
        }

        if (seller?.fcmtoken) {
          const payload: Message = {
            token: seller?.fcmtoken || "",
            notification: {
              title: "Order Confirm",
              body: `${user?.firstname} ${user?.lastname} has placed an order`,
            },
            // webpush: {
            //   fcmOptions: {
            //     link,
            //   },
            // },
          };
          await admin.messaging().send(payload);
        }

        await prisma.notification.create({
          data: {
            title: "Order Confirm",
            message: `${user?.firstname} ${user?.lastname} has placed an order`,
            userId: sellerId,
            isRead: false,
          },
        });
      }

      return {
        message: `You Have Successfully purchased`,
        status: 201,
        order: newOrder,
      };
    } else {
      return {
        message: `Product not available or out of stock`,
        status: 400,
      };
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      message: `Failed to create order`,
      status: 500,
      error: error,
    };
  }
};

export const fetchOrders = async (userId: string, type: string) => {
  try {
    let orders;

    if (type === "consumer") {
      orders = await prisma.orderSchema.findMany({
        where: { userId: userId },
        include: {
          product: true,
        },
      });
    } else if (type === "seller") {
      orders = await prisma.orderSchema.findMany({
        where: { sellerId: userId },
        include: {
          product: true,
        },
      });
    } else {
      throw new Error("Invalid type provided");
    }

    const orderWithSellerDetails = await Promise.all(
      orders.map(async (item) => {
        const sellerInfo = await prisma.sellerInfo.findUnique({
          where: {
            sellerId: item.sellerId,
          },
        });
        const user = await prisma.user.findUnique({
          where: {
            id: item.userId,
          },
        });

        const productinfo: any = await prisma.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        const media = productinfo.media.map(async (media: any) => {
          return await getSignedURL(media);
        });

        const updatedproduct = {
          ...productinfo,
          media: await Promise.all(media),
        };

        return {
          ...item,
          sellerinfo: sellerInfo,
          product: updatedproduct,
          user: user,
        };
      })
    );

    return {
      message: `You Have Successfully purchased`,
      status: 201,
      order: orderWithSellerDetails,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      message: `No orders Found`,
      status: 500,
      error: error,
    };
  }
};

export const updateOrderStatus = async (orderId: string, status: any) => {
  try {
    const updatedOrder = await prisma.orderSchema.update({
      where: { id: orderId },
      data: {
        status: status,
      },
    });

    return {
      message: `Order status updated successfully`,
      status: 200,
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      message: `Failed to update order status`,
      status: 500,
      error: error,
    };
  }
};
