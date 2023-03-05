import React, { useState, useEffect } from 'react'
import { BsWallet, BsBell } from 'react-icons/bs'
import { FiMenu } from 'react-icons/fi'
import { BiRupee, BiUser, BiPowerOff } from "react-icons/bi";
import { VscDashboard } from "react-icons/vsc";
import {
    HStack,
    Text,
    Box,
    VStack,
    Spacer,
    Show,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import Link from 'next/link'
import Head from 'next/head'
import Sidebar, { ServicesAccordion } from './Sidebar'
import BankDetails from './BankDetails'
import Cookies from 'js-cookie';
let bcrypt = require('bcryptjs')
import { useRouter } from 'next/router';
import axios from '../lib/axios';
import Topbar from './Topbar';


const DashboardWrapper = (props) => {
    const [newNotification, setNewNotification] = useState(true)
    const [isProfileComplete, setIsProfileComplete] = useState(false)
    const [userName, setUserName] = useState("No Name")
    const [userType, setUserType] = useState("Undefined")
    const [userImage, setUserImage] = useState("/avatar.png")
    const { isOpen, onOpen, onClose } = useDisclosure()
    var sessionExpiry = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
    const Router = useRouter()

    useEffect(() => {
        setIsProfileComplete(localStorage.getItem("isProfileComplete") === "true")
        setUserName(localStorage.getItem("userName"))
        setUserType(localStorage.getItem("userType"))
        Cookies.set("verified", Cookies.get("verified"), { expires: sessionExpiry })

        // Check for new notifications

    }, [])

    useEffect(() => {
        let authentic = bcrypt.compareSync(`${localStorage.getItem("userId") + localStorage.getItem("userName")}`, Cookies.get("verified"))
        if (authentic != true) {
            axios.post("/logout").then(() => {
                Cookies.remove("verified")
            })
            setTimeout(() => Router.push("/auth/login"), 2000)
        }
    })
    async function signout() {
        await axios.post("/logout").then(() => {
            Cookies.remove("verified")
        })
        setTimeout(() => Router.push("/auth/login"), 2000)
    }

    return (
        <>
            <Head><title>{`Pesa24 - ${props.titleText}`}</title></Head>

            <Box
                bg={'aliceblue'}
                w={'full'} minH={'100vh'}>

                <HStack spacing={8} alignItems={'flex-start'}>
                    {/* Sidebar */}
                    <Sidebar
                        isProfileComplete={isProfileComplete}
                        userName={userName}
                        userType={userType.toUpperCase()}
                        userImage={userImage}
                    />

                    {/* Main Dashboard Container */}
                    <Box
                        p={4}
                        display={'flex'}
                        flexDir={'column'}
                        flex={['unset', 8]}
                        w={'full'} h={'100vh'}
                        overflowY={'scroll'}
                    >
                        <Topbar />

                        {/* Topbar Starts */}
                        <HStack
                            pt={[4, 0]}
                            pb={[0, 2]}
                            px={[0, 2]}
                        >
                            <Show below={'md'}>
                                <Box fontSize={'2xl'} onClick={onOpen}>
                                    <FiMenu color='#333' />
                                </Box>
                            </Show>
                            <Text fontSize={'xl'} fontWeight={'500'} color={'#333'}>{props.titleText}</Text>
                            <Spacer />
                            <HStack
                                spacing={4}
                                w={'auto'}
                                display={["none", "flex"]}
                            >

                                <Link href={'#'}>
                                    <HStack boxShadow={'md'}
                                        p={1} px={3} w={'auto'}
                                        spacing={2}
                                        rounded={'full'}
                                        bg={'white'}
                                        justifyContent={'flex-start'}
                                    >
                                        <Box
                                            boxSize={'8'}
                                            bg={'#FF7B54'} color={'white'}
                                            rounded={'full'}
                                            display={'grid'} placeContent={'center'}
                                        >
                                            <BsWallet />
                                        </Box>
                                        <VStack w={'auto'} spacing={0}
                                            alignItems={'flex-start'}
                                            justifyContent={'center'}
                                        >
                                            <Text fontSize={'xs'} color={'#888'} mb={0}>DMT</Text>
                                            <h2>₹ {props.dmt || 0}</h2>
                                        </VStack>
                                    </HStack>
                                </Link>

                                <Link href={'#'}>
                                    <HStack boxShadow={'md'}
                                        p={1} px={3} w={'auto'}
                                        spacing={2}
                                        rounded={'full'}
                                        bg={'white'}
                                        justifyContent={'flex-start'}
                                    >
                                        <Box
                                            boxSize={'8'}
                                            bg={'#FFB100'} color={'white'}
                                            rounded={'full'}
                                            display={'grid'} placeContent={'center'}
                                        >
                                            <BsWallet />
                                        </Box>
                                        <VStack w={'auto'} spacing={0}
                                            alignItems={'flex-start'}
                                            justifyContent={'center'}
                                        >
                                            <Text fontSize={'xs'} color={'#888'} mb={0}>Wallet</Text>
                                            <h2>₹ {props.prepaid || 0}</h2>
                                        </VStack>
                                    </HStack>
                                </Link>
                                <Spacer w={8} />
                                <Box
                                    pos={'relative'}
                                    boxSize={'10'} p={2} cursor={'pointer'}
                                    color={'gray.600'} boxShadow={'md'}
                                    rounded={'full'} bg={'white'}
                                    display={'grid'} placeContent={'center'}
                                >
                                    <BsBell fontSize={'20'} />
                                    {newNotification ? <Box boxSize={'2'} rounded={'full'} bg={'red'} position={'absolute'} top={'3'} right={'3'}></Box> : null}
                                </Box>

                            </HStack>
                        </HStack>
                        {/* Topbar Ends */}

                        {props.children}

                    </Box>


                </HStack>
            </Box>

            {/* Mobile Sidebar */}
            <Show below={'md'}>
                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                    size={'xs'}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            <Text fontWeight={'semibold'}>Pesa24</Text>
                        </DrawerHeader>

                        <DrawerBody mt={8}>

                            <VStack spacing={6}>
                                <Link href={'/dashboard'} style={{ width: '100%' }}>
                                    <HStack spacing={2}>
                                        <VscDashboard fontSize={'1.5rem'} />
                                        <Text fontSize={'lg'}>
                                            Dashboard
                                        </Text>
                                    </HStack>
                                </Link>

                                <Link href={'/dashboard/profile'} style={{ width: '100%' }}>
                                    <HStack spacing={2}>
                                        <BiUser fontSize={'1.5rem'} />
                                        <Text fontSize={'lg'}>
                                            Profile
                                        </Text>
                                    </HStack>
                                </Link>

                                <ServicesAccordion />


                            </VStack>

                            <BankDetails />
                        </DrawerBody>

                        <DrawerFooter justifyContent={'center'}>
                            <VStack w={'full'} spacing={8}>
                                <HStack w={'full'} spacing={4} justifyContent={'space-between'}>
                                    <Box>
                                        <Text fontSize={'xs'} color={'#888'}>DMT Wallet</Text>
                                        <Text fontSize={'xl'}>₹ {props.dmt || 0}</Text>
                                    </Box>
                                    <Box>
                                        <Text fontSize={'xs'} color={'#888'}>Prepaid Wallet</Text>
                                        <Text fontSize={'xl'}>₹ {props.prepaid || 0}</Text>
                                    </Box>
                                </HStack>
                                <HStack spacing={2} color={'red'} onClick={() => signout()}>
                                    <BiPowerOff fontSize={'1.5rem'} />
                                    <Text fontSize={'lg'}>
                                        Sign Out
                                    </Text>
                                </HStack>
                            </VStack>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Show>
        </>
    )
}

export default DashboardWrapper