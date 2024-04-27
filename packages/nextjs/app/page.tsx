"use client";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "mapbox-gl/dist/mapbox-gl.css";

import * as mapboxgl from "mapbox-gl";

import {
  Avatar,
  ChatContainer,
  ConversationHeader,
  InfoButton,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageModel,
  TypingIndicator,
  VideoCallButton,
  VoiceCallButton,
} from "@chatscope/chat-ui-kit-react";
import { Button, Form, FormInstance, Input, InputNumber, Upload } from "antd";
import { Col, Modal, Row } from "antd";
import Map, { Marker, Popup } from "react-map-gl";
import { RcFile, UploadProps } from "antd/lib/upload";
import { Route, Routes, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Address } from "~~/components/scaffold-eth";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Image from "next/image";
import { Link } from "@mui/material";
import { MessageDirection } from "@chatscope/chat-ui-kit-react/src/types/unions";
import type { NextPage } from "next";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import Typography from "@mui/material/Typography";
import { UploadOutlined } from "@ant-design/icons";
import classes from "./Page.module.css";
import { historicalSites } from "./historicalSites";
import lighthouse from "@lighthouse-web3/sdk";
import { useAccount } from "wagmi";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Fetch API key from .env file

const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

const baseURL = "https://eth-mainnet.g.alchemy.com/v2/374l9-eucheJf7r_lvnEZbEJ3dmtKRqn";
const polygonBaseURL = "https://polygon-mainnet.g.alchemy.com/v2/374l9-eucheJf7r_lvnEZbEJ3dmtKRqn";
const cardonaBaseURL = "https://polygonzkevm-testnet.g.alchemy.com/v2/F-C_L0Ca71E5bpgTdRznn-r3bUPRatnk";

interface NFT {
  title: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  startYear: number;
  endYear: number;
}
const requestOptions: RequestInit = {
  method: "GET",
  redirect: "follow" as RequestRedirect | undefined,
};

function speak(ttsContent: string) {
  // Create a SpeechSynthesisUtterance
  const utterance = new SpeechSynthesisUtterance(ttsContent);

  // Select a voice
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices[0]; // Choose a specific voice

  // Speak the text
  speechSynthesis.speak(utterance);
}

// E-Transfer
async function etransfer({ email, amount }: { email: string; amount: number }) {
  const message = `Transferring $${amount} to email: ${email}`;
  alert(message);
  return message;
}

const Home: NextPage = () => {
  const { address } = useAccount();
  const params = useSearchParams();
  const walletAddress = params.get("walletAddress"); // Get specific search param

  // State for storing the connected address
  const [connectedAddress, setConnectedAddress] = useState<string | null>(address || null);

  useEffect(() => {
    // Update connected address based on walletAddress from URL
    if (walletAddress) {
      setConnectedAddress(walletAddress);
      console.log("Connected address set from URL parameter:", walletAddress);
    }
  }, [walletAddress]); // Dependency array includes only walletAddress to react on its changes

  useEffect(() => {
    if (connectedAddress) {
      setNfts(historicalSites as never[]);
    } else {
      setNfts([]);
    }

    // const url = `${baseURL}/getNFTs/?owner=${connectedAddress}`;

    // fetch(url, requestOptions)
    //   .then(response => response.json())
    //   .then(result => {
    //     console.log(result);
    //     setNfts(prevNfts => [...prevNfts, ...result.ownedNfts] as never[]);
    //     setStep(1);
    //   })
    //   .catch(error => console.log("error", error));
  }, [connectedAddress]);

  const [form] = Form.useForm();

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loanRequested, setLoanRequested] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState<NFT | null>(null);

  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [ipfsLink, setIpfsLink] = useState("");

  const [systemMessage, setSystemMessage] = useState({
    //  Explain things like you're talking to a software professional with 5 years of experience.
    role: "system",
    content: `Hello! I am ${selectedNft?.title || " an NFT"}. ${selectedNft?.description?.slice(0, 100)}`,
  });

  const storeWeb3FilesTest = async (address: string, nft: any) => {
    const currentTime = new Date().toISOString();
    const text = `Borrower: ${address}
    
NFT Collateral: ${JSON.stringify(nft, null, 2)}

Time: ${currentTime}
    
Loan Amount: 100 USDC
    `;
    const apiKey = "13d44665.a912997a74e3434f8ce7a7ca7a2135f7";
    const name = `${currentTime} - Loan for ${address} with the NFT ${nft.title} as collateral.`; //Optional

    const response = await lighthouse.uploadText(text, apiKey, name);

    console.log(response);

    setIpfsLink("https://gateway.lighthouse.storage/ipfs/" + response.data.Hash);
  };

  const cardContent = (nft: any, buttons: any) => (
    <Card sx={{ width: 250, borderRadius: "1em", alignSelf: "center" }}>
      <CardMedia
        sx={{
          height: 350,
          objectFit: "cover",
          borderBottomRightRadius: "1em",
          borderBottomLeftRadius: "1em",
        }}
        image={
          nft.imageUrl ||
          nft.media[0].gateway ||
          nft.media[0].thumbUrl ||
          "https://res.cloudinary.com/simpleview/image/upload/v1699908801/clients/boston-redesign/6ETOS4g0_c4045e9b-d897-4012-8d4c-4ba218d7a389.jpg"
        }
        title={nft.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {nft.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <ReactMarkdown>{nft.description}</ReactMarkdown>
        </Typography>
        <div>{buttons}</div>
      </CardContent>
    </Card>
  );

  const info = (nft: any) => {
    Modal.info({
      title: nft.title,
      content: cardContent(nft, null),
      onOk() {},
    });
  };

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);

    // create nft with values
    // mint(values)

    if (connectedAddress) {
      values.address = connectedAddress;

      setNfts(prevNfts => [values, ...prevNfts] as never[]);
    }
  };

  // Custom upload logic (mock)
  const dummyRequest: UploadProps["customRequest"] = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess?.("ok", new XMLHttpRequest());
    }, 0);
  };

  const normFile = (e: any): any => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const [messages, setMessages] = useState([
    {
      message: `Hello. ${selectedNft?.title || " an NFT"}. ${selectedNft?.description?.slice(0, 100)}`,
      direction: "incoming",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message: any) => {
    setIsTyping(true);

    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    await processMessageToChatGPT(newMessages);
  };

  const mapRef = useRef(null);

  async function processMessageToChatGPT(chatMessages: any[]) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    const apiMessages = chatMessages.map(messageObject => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const tools = [];
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
      // tools: tools,
      // tool_choice: "auto", // auto is default, but we'll be explicit
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then(data => {
        return data.json();
      })
      .then(async data => {
        const response = data;
        console.log("messages: ", messages);
        console.log("response: ", response);

        const responseMessage = response.choices[0].message;

        // Step 2: check if the model wanted to call a function
        const toolCalls = responseMessage.tool_calls;
        if (responseMessage.tool_calls) {
          // Step 3: call the function
          // Note: the JSON response may not always be valid; be sure to handle errors
          const availableFunctions = {
            etransfer: etransfer,
          }; // only one function in this example, but you can have multiple
          messages.push(responseMessage); // extend conversation with assistant's reply
          for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionToCall = availableFunctions[functionName as keyof typeof availableFunctions];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = await functionToCall(functionArgs);
            console.log("functionResponse: ", functionResponse);
            // setMessages([
            //   ...chatMessages,
            //   {
            //     tool_call_id: toolCall.id,
            //     role: "tool",
            //     name: functionName,
            //     content: functionResponse,
            //   },
            // ]);
            const newMessages = [
              systemMessage, // The system message DEFINES the logic of our chatGPT
              ...apiMessages, // The messages from our chat with ChatGPT
              {
                role: "assistant",
                content: `You have ran the function ${functionName}, here are the results: ${functionResponse}. Inform the user of the results.`,
              },
            ];
            console.log("newMessages: ", newMessages);
            // const secondResponse = await openai.chat.completions.create({
            //   model: "gpt-3.5-turbo-0125",
            //   messages: newMessages,
            // }); // get a new response from the model where it can see the function response
            // console.log(messages);
            // console.log("secondResponse: ", secondResponse);
            // // add tool response to set messages
            // setMessages([
            //   ...chatMessages,
            //   {
            //     message: secondResponse.choices[0].message.content,
            //     sender: "ChatGPT",
            //   },
            // ]);
          }
        } else {
          const textResponse = data.choices[0].message.content;
          setMessages([
            ...chatMessages,
            {
              message: textResponse,
              direction: "incoming",
              sender: "ChatGPT",
            },
          ]);
          speak(textResponse);
        }
        setIsTyping(false);
        console.log(messages);
      });
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 text-center">
        <div className="px-5">
          {(step === 1 || step === 0) && (
            <h1 className="text-center">
              <span className="block text-2xl mb-2">Welcome to</span>
              <span className="block text-4xl font-bold">MonuMints!</span>
              <p className="text-center">Connect your wallet to get started!</p>
            </h1>
          )}
          {connectedAddress && (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex justify-center items-center space-x-2">
                <p className="my-2 font-medium">Connected Address:</p>
                <Address address={connectedAddress} />
              </div>
            </div>
          )}

          {step === 1 && connectedAddress && <div style={{ display: "flex", alignContent: "center" }}></div>}
          {false && step === 1 && (
            <div style={{ display: "flex", alignContent: "center" }}>
              <br />
              <strong>Or choose one of your existing NFTs:</strong>
              <br />
            </div>
          )}

          {step === 0 && nfts.length == 0 && connectedAddress && (
            <div>
              <Button
                onClick={() => {
                  setNfts([]);

                  const url = `${baseURL}/getNFTs/?owner=${connectedAddress}`;

                  fetch(url, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                      console.log(result);
                      setNfts(prevNfts => [...prevNfts, ...result.ownedNfts] as never[]);
                      setStep(1);
                    })
                    .catch(error => console.log("error", error));

                  // const polygonUrl = `${polygonBaseURL}/getNFTs/?owner=${connectedAddress}`;

                  // fetch(polygonUrl, requestOptions)
                  //   .then(response => response.json())
                  //   .then(result => {
                  //     console.log(result);
                  //     setNfts(prevNfts => [...prevNfts, ...result.ownedNfts] as never[]);
                  //     setStep(1);
                  //   })
                  //   .catch(error => console.log("error", error));
                }}
              >
                Fetch NFTs
              </Button>
            </div>
          )}
          <br />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            {(step === 0 || step === 1) && connectedAddress && (
              <Card sx={{ width: "250px", borderRadius: "1em", padding: "10px" }}>
                <strong>Create your own Historical NFT!</strong>
                <br />
                <br />
                <Form form={form} name="rwa_collateral" onFinish={onFinish} layout="vertical">
                  <Form.Item
                    name="title"
                    label="Historical NFT Name"
                    rules={[{ required: true, message: "Please input the name of the item!" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="description"
                    label="Historical NFT Description"
                    rules={[{ required: true, message: "Please input a description of the item!" }]}
                  >
                    <Input.TextArea />
                  </Form.Item>
                  <Form.Item
                    name="imageUrl"
                    label="Historical NFT Image URL"
                    rules={[{ required: true, message: "Please input the name of the item!" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="latitude"
                    label="Historical NFT Image Latitude"
                    rules={[{ required: true, message: "Please input the name of the item!" }]}
                  >
                    <Input type="number" defaultValue={79} />
                  </Form.Item>
                  <Form.Item
                    name="longitude"
                    label="Historical NFT Image Latitude"
                    rules={[{ required: true, message: "Please input the name of the item!" }]}
                  >
                    <Input type="number" defaultValue={43} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            )}

            {(step === 0 || step === 1) &&
              nfts &&
              nfts.length > 0 &&
              nfts.map((nft: any, index) => (
                <>
                  {cardContent(
                    nft,
                    <Button
                      onClick={() => {
                        setStep(2);
                        setSelectedNft(nft);
                        setSystemMessage({
                          role: "system",
                          content: `Respond to the user as if you are ${
                            nft.title || " an NFT"
                          }. Description: ${nft.description?.slice(0, 1000)}...`,
                        });
                        setMessages([
                          {
                            message: nft.description,
                            direction: "incoming",
                            sender: "ChatGPT",
                          },
                        ]);
                        speak(nft.description);
                      }}
                      style={{ marginLeft: "10px" }}
                      type="primary"
                    >
                      Chat!
                    </Button>,
                  )}
                </>
              ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {step === 2 &&
              [selectedNft].map((nft: any, index) => (
                <>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    {cardContent(
                      nft,
                      <Button
                        onClick={() => {
                          setStep(1);
                          setSelectedNft(null);
                        }}
                      >
                        End Conversation
                      </Button>,
                    )}
                    <div
                      style={{
                        position: "relative",
                        maxWidth: "700px",
                        maxHeight: "600px",
                        minWidth: "500px",
                        minHeight: "500px",
                        borderRadius: "30px",
                        marginLeft: "10px",
                      }}
                    >
                      <MainContainer>
                        <ChatContainer>
                          <ConversationHeader>
                            <Avatar
                              src={
                                nft.imageUrl ||
                                nft.media[0].gateway ||
                                "https://static.vecteezy.com/system/resources/previews/004/619/774/original/laughing-robot-emoji-color-icon-happy-chatbot-smiley-with-broad-smile-and-closed-eyes-chat-bot-emoticon-artificial-conversational-entity-virtual-assistant-isolated-illustration-vector.jpg"
                              }
                              name={nft.title || "NFT"}
                            />
                            <ConversationHeader.Content userName={nft.title || "NFT"} info="🟢 Active now" />
                            <ConversationHeader.Actions>
                              <VoiceCallButton />
                              <VideoCallButton />
                              <InfoButton />
                            </ConversationHeader.Actions>
                          </ConversationHeader>
                          <MessageList
                            scrollBehavior="smooth"
                            typingIndicator={isTyping ? <TypingIndicator content={nft.title + ` is typing`} /> : null}
                          >
                            {messages.map((message, i) => {
                              const model: MessageModel = {
                                message: message.message,
                                direction: message.direction as MessageDirection,
                                sender: message.sender,
                                position: "normal", // Add the 'position' property here
                              };
                              return <Message key={i} model={model} />;
                            })}
                          </MessageList>
                          <MessageInput placeholder="Type message here" onSend={handleSend} />
                        </ChatContainer>
                      </MainContainer>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>

        {/* <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div> */}
      </div>
      <div className={classes.mainStyle}>
        <Map
          ref={mapRef}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          initialViewState={{ latitude: 42.3601, longitude: -71.0589, zoom: 12 }}
          maxZoom={30}
          minZoom={1}
          style={classes.mapStyle as React.CSSProperties}
        >
          {nfts.map((nft, index) => {
            return (
              <Marker
                key={index}
                longitude={(nft as { longitude?: number }).longitude || 43}
                latitude={(nft as { latitude?: number }).latitude || -79}
                onClick={() => {
                  console.log(nft);
                  info(nft);
                }}
              >
                <img
                  style={{
                    height: 50,
                    objectFit: "cover",
                    borderBottomRightRadius: "1em",
                    borderBottomLeftRadius: "1em",
                  }}
                  src={
                    nft.imageUrl ||
                    "https://res.cloudinary.com/simpleview/image/upload/v1699908801/clients/boston-redesign/6ETOS4g0_c4045e9b-d897-4012-8d4c-4ba218d7a389.jpg"
                  }
                ></img>
              </Marker>
            );
          })}
          {selectedMarker ? (
            <Popup
              offset={25}
              longitude={(selectedMarker as { longitude?: number }).longitude || 43}
              latitude={(selectedMarker as { latitude?: number }).latitude || -79}
              onClose={() => {
                setSelectedMarker(null);
              }}
              closeButton={false}
            >
              <h3 className={classes.popupTitle}>{selectedMarker.title}</h3>
              <div className={classes.popupInfo}>
                <label className={classes.popupLabel}>Description: </label>
                <span>{selectedMarker.description}</span>
                <br />
              </div>
            </Popup>
          ) : null}
        </Map>
      </div>
    </>
  );
};

export default Home;
