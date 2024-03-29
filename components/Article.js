import Head from 'next/head';
import Image from "next/image";
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";

import StarRatings from './StarRatings.js';
import Toast from './Toast.js';

import articleStyles from '../styles/Article.module.css'
import buttonStyles from '../styles/Button.module.css'

import { ShareTo } from '../utils/share';

import { FaRegEnvelope, FaRegClipboard, FaWhatsapp, FaTwitter } from 'react-icons/fa'



export default function Article({ data }) {
    const router = useRouter()
    const [readTimeEstimate, setReadTimeEstimate] = useState("3 min")
    const [linkCopied, setlinkCopied] = useState("")

    useEffect(() => {
        // if (data) {
        const avgWordsPerMinute = 265;
        let readTimeEstimate;
        const words = data.attributes.body.split(" ");
        let totalWordCount = words.length;

        let minutes;

        if (!data.attributes.body) {
            minutes = 0
        } else if (totalWordCount <= avgWordsPerMinute) {
            minutes = 2;
        } else {
            minutes = totalWordCount / avgWordsPerMinute;
        }

        const formattedMinutes = minutes.toFixed(0)

        if (minutes < 2) {
            readTimeEstimate = 2;
        } else {
            readTimeEstimate = formattedMinutes.toString()
        }

        setReadTimeEstimate(readTimeEstimate + " min");

        // }



        // getWordCount(data.attributes.body).then(res => setReadTimeEstimate(res + " min"))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const sharePage = (shareType) => {
        const shareItem = new ShareTo(data)

        if (shareType === "email") {
            shareItem.email()
        } else if (shareType === "copy") {
            shareItem.copyLink()
            setlinkCopied("Link copied!")
            setTimeout(() => {
                setlinkCopied("")
            }, 3000);
        } else if (shareType === "whatsapp") {
            shareItem.whatsapp()
        } else if (shareType === "twitter") {
            shareItem.twitter()
        }

    }

    // This is vital to stop issue in build where next tries to access data from the api that isn't ready yet
    if (router.isFallback || !data || data === {}) {

        return null
    }

    const dayjs = require('dayjs')
    var advancedFormat = require('dayjs/plugin/advancedFormat')
    dayjs.extend(advancedFormat)

    const metaDescription = data.attributes.type === "review" ? `Marcereads' ${data.attributes.type} of ${data.attributes.title} by ${data.attributes.author}` : `Marcereads' ${data.attributes.type} - ${data.attributes.title}`

    const metaUrl = process.env.NODE_ENV === "development" ? `${process.env.DEV_SITE_URL}${router.asPath}` : `${process.env.PROD_SITE_URL}${router.asPath}`
    console.log(metaUrl)

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta property="og:title" content={data.attributes.title} />
                <meta property="og:description" content={metaDescription} />
                <meta charSet="utf-8" />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={metaUrl} />
                <meta property="og:image" content={data.attributes.main.data.attributes.formats.thumbnail.url} />
                <meta property="og:summary_large_image" content={data.attributes.main.data.attributes.formats.small} />
                <meta property="og:image:alt" content={metaDescription} />

                <meta name="twitter:title" content={data.attributes.title} />
                <meta name="twitter:card" content="summary"></meta>
                <meta naem="twitter:description" content={metaDescription} />
                <meta name="twitter:image" content={data.attributes.main.data.attributes.formats.thumbnail.url} />
                <meta name="twitter:summary_large_image" content={data.attributes.main.data.attributes.formats.small} />
                <meta name="twtter:image:alt" content={metaDescription} />

                <title>{data.attributes.title}</title>
                {/* https://youtu.be/-B58GgsehKQ?t=406 */}
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={articleStyles.article}>
                {/* <Toast /> */}
                <header className={articleStyles.header}>
                    <h1 itemProp="name headline" className={articleStyles.title}>{data.attributes.title}</h1>
                    <h2 className={articleStyles.author}>{data.attributes.author}</h2>
                    <div className={articleStyles.top_row}>
                        <h5 type={data.attributes.type}>{data.attributes.type}</h5>
                    </div>
                    <div className={articleStyles.bottom_row}>

                        <h5 className={articleStyles.length}>{readTimeEstimate}</h5>
                        <h4 className={articleStyles.date}>{dayjs(data.attributes.date).format("Do MMM YYYY")}</h4>

                    </div>
                    {data.attributes.type === "review" ? <StarRatings rating={data.attributes.rating} /> : null}
                </header>
                <article itemScope itemType="http://schema.org/Article">
                    <meta itemProp="datePublished" content={data.attributes.createdAt} />
                    <meta itemProp="publisher" content="marcereads" />
                    <div className={articleStyles.image_wrapper}>
                        <Image src={data.attributes.main.data.attributes.url} placeholder="blur" blurDataURL={data.attributes.main.data.attributes.formats.thumbnail.url} objectFit="cover" alt="Relevant book for article" layout="fill" />
                    </div>
                    <ReactMarkdown>
                        {data.attributes.body}
                    </ReactMarkdown>
                    <div className={buttonStyles.group_social_container}>
                        <div className={buttonStyles.button_group_social}>
                            <button className={buttonStyles.button} type={"social"} onClick={() => sharePage("email")}><FaRegEnvelope /></button>
                            <button className={buttonStyles.button} type={"social"} onClick={() => sharePage("copy")}><FaRegClipboard /></button>
                            <button className={buttonStyles.button} type={"social"} onClick={() => sharePage("whatsapp")}><FaWhatsapp /></button>
                            <button className={buttonStyles.button} type={"social"} onClick={() => sharePage("twitter")}><FaTwitter /></button>
                        </div>
                        <p>{linkCopied}</p>
                    </div>
                </article>
            </div>
        </>)
}
