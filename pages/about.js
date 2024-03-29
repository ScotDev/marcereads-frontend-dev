import Image from "next/image";
import Head from "next/head";

import ReactMarkdown from "react-markdown";

import headerStyles from '../styles/Header.module.css'
import aboutStyles from '../styles/About.module.css'

import fetchData from "../utils/fetchData.js";

import Error from '../components/Error'

export default function about({ data }) {

    if (!data || data === {}) {
        return <Error />
    }


    return (<>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>About</title>
            <meta name="description" content="Marcereads blog" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className={headerStyles.header}>
            <h1 className={headerStyles.page_title}>About me</h1>
        </header>

        <section className={aboutStyles.about}>
            <div className={aboutStyles.profile_image_wrapper}>
                <Image src={data.attributes.profile_image.data.attributes.url} placeholder="blur" blurDataURL={data.attributes.profile_image.data.attributes.formats.thumbnail.url} objectFit="cover" alt="Portait of site's author" layout="fill" ></Image>
            </div>
            <article>
                <ReactMarkdown>
                    {data.attributes.body}

                </ReactMarkdown>
            </article>
        </section>

    </>
    )
}

export const getStaticProps = async () => {

    try {
        const { data } = await fetchData("about")

        return {
            props: {
                data: data
            }
        }
    } catch (error) {
        return {
            props: {}
        }
    }


}