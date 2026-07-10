import React, { useState, useEffect } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { Content } from "./Content";

import PaginationComponent from "./Pagination";
const Privacy = ({}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const contentMapping = {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      security: "Security",
    };

    setSelectedContent(contentMapping[id] || "Guidelines and Policies");
  }, [id]);
  const sideTabs = [
    { title: "Guidelines and Policies" },
    { title: "Privacy Policy" },
    { title: "Terms of Service" },
    { title: "API Policy" },
    { title: "CSR" },
    { title: "Security" },
    {
      title: "Products",
      items: [
        {
          subTitle: "Gift Card",
          subItems: ["Gift Card"],
        },
        {
          subTitle: "Vibe",
          subItems: ["India", "UAE"],
        },
        {
          subTitle: "Zomaland",
          subItems: ["Ticketing Policy", "Restaurant Partner Policy"],
        },
        {
          subTitle: "Zomato UPI",
          subItems: ["Zomato UPI"],
        },
        {
          subTitle: "Train Ordering",
          subItems: ["Train Ordering"],
        },
        {
          subTitle: "Events",
          subItems: [
            "Merchant Policy",
            "Event Ticketing",
            "Feeding India Concert Ticketing",
          ],
        },
        {
          subTitle: "Ads",
          subItems: [
            "Ads Policy",
            "Visit Pack Policy",
            "Branding On Search Policy",
            "Visit Pack Plus Policy",
            "Video Ads Policy",
            "Extra Inventory Policy",
            "Standard Legendary Pack Policy",
            "Gold Pack Policy",
            "Haleem Policy",
            "Festive Ads Policy",
            "ZPL Policy",
            "Dining Visit Pack Policy",
            "Dining Impression Pack Policy",
            "Growth Pack Policy",
            "AI Video Visit Pack Policy",
            "Zomato Plus Ads Policy",
            "Brand Tiles Policy",
            "Package Visit Pack Policy",
            "Deal of the Day Policy",
            "Guaranteed ROI Policy",
            "Off App Visit Pack Policy",
            "Hyperpure Credits Visit Pack Policy",
          ],
        },
        {
          subTitle: "Deals",
          subItems: ["Merchant Policy", "Customer Policy"],
        },
        {
          subTitle: "Celebration Services",
          subItems: ["Customer Enrolment Form"],
        },
        {
          subTitle: "Games",
          subItems: ["Trivia Policy", "ZPL Policy"],
        },
        {
          subTitle: "Dining Party Packages",
          subItems: ["Merchant policy"],
        },
        {
          subTitle: "Zomato For Enterprise",
          subItems: ["For Enterprise", "For Customer"],
        },
        {
          subTitle: "Zomato Money",
          subItems: ["Zomato Money"],
        },
        {
          subTitle: "Zomato Dining Experiences",
          subItems: ["India", "UAE"],
        },
      ],
    },
  ];

  const content = [
    {
      index: "Guidelines and Policies",
      content:
        "If there's one thing we truly love, it's sharing in all the great foodie moments you have. Bouquets when the food exceeds your expectations, brickbats when the service is shocking, chronicles of your food excursions – they all count.\n\nWhile we welcome your opinions and descriptions of your dining experiences, there are a few things we expect from every user on Zomato. Your reviews and photos, as well as your profile and the comments you share, are all subject to Content Guidelines, our Foodie Code of Conduct.\n\nIf your activity on Zomato doesn't match up to these content guidelines, we reserve the right to take action as we deem necessary. This could include altering or deleting your reviews or comments, restricting your review activity or deleting your Zomato account altogether, with or without notice. Zomato also utilizes an algorithm to aid in removing suspicious reviews.\n\nIf you see content that does not align with these guidelines or our Terms of Service, please let us know. We will consider all reports. However, due to the diversity of our community, it is possible that content disagreeable to you might not meet the criteria to be removed.",
      subsections: {
        heading: "Foodie Code of Conduct",
        subheading: [
          {
            heading: "Keep out the clutter",
            info: "To make sure we collectively work towards building the highest-quality content that's useful to everyone, reviews need to be a minimum of 140 characters long for dine-in reviews. That's just about the length of a tweet, so it's convenient even for all you micro-bloggers. If you cover the food, service and ambiance, you shouldn't fall short on characters. We do not have a 140 characters limit for an online order review. However, if any review is filled with junk, we might have to remove the review altogether.",
          },
          {
            heading: "Keep it relevant",
            info: "Please keep your contributions relevant to Zomato. Accounts placing irrelevant, inappropriate or promotional content, reviews with server names, reviews with similar digital signatures that spam restaurants or are based on any already disclaimed or informed policies and practices of a restaurant may be deleted without notice. If your review has been removed or moderated by us and if you repost another experience for the same restaurant, we reserve the right to remove that review too, even though such review might be in line with our content guidelines. In the case of spam, we can restrict your review activity on Zomato.",
          },
          {
            heading: "Keep it clean",
            info: "Whether you're writing a small snippet or a delightfully detailed account of your meal, keep foul/abusive/hateful language, threats, and lewdness out of it. We, just like you, hate junk and will delete it whenever we see it. This also includes (but is not limited to) derogatory comments on someone's protected characteristics (e.g. race, gender, religion) or indication of a personal vendetta against a business and its associates.",
          },
          {
            heading: "Keep it fresh",
            info: "Only one review per restaurant for a dine-out experience and one review for each online order transaction can be submitted and your most recent experience at a place counts. That's what is going to help people when they're trying to decide whether or not to eat there. You're free to edit and update your review based on subsequent visits at any time. Reviews about old experiences (more than 6 months old) will also be deleted from our platform.",
          },
          {
            heading: "Keep it real",
            info: "Write your review based on facts and your own experiences (e.g. not a friend's or any hearsay experience or based on media reports). Please don't exaggerate or falsify your experience. We do not take sides in cases of dispute, so make sure you can stand by your word. Content that indicates the reviewer hasn't even visited or availed any services from the restaurant will be removed. For example, 'Never been here, never want to. Management is horrible and the food is worse!' Deceptive, fake, or misleading reviews will be removed. Reviewing a bunch of fast-food outlets in quick succession (even if you eat at them more often than you should) is considered suspicious activity, and it's likely these reviews will be moderated. Accepting or soliciting a kickback – monetary or otherwise – in exchange for reviews or photographs is also not acceptable, and could result in removal of your profile.",
          },
          {
            heading: "Don't solicit",
            info: "Identifying or promoting yourself as an official Zomato blogger, or using your status to solicit any kind of benefits (including but not limited to accepting money, free meals, drinks) in exchange for reviews, or at the threat of negative reviews on Zomato, will not be tolerated. If reports or evidence of such instances are brought to our attention, we reserve the right to delete your Zomato profile or take any other action that we may deem fit, no questions asked.",
          },
          {
            heading: "Don't steal",
            info: "Plagiarism is something we take seriously. Copying others' reviews or photos from Zomato or other platforms, or even reposting your own in multiple places on Zomato (in full or in part), is something that will not be tolerated and may be removed/ moderated. We trust that you'll play fair and create your own content.",
          },
          {
            heading: "Tell the whole story",
            info: "If you luck into a free meal or dine as a guest of the restaurant, or have a relevant association with a restaurant or its owners, give full disclosure in your review. We're sure that honesty is the best policy, and other users will respect you even more for it. If you have made it to the major league as a food writer or critic, let us know and we can provide special access for your blog link to appear with your reviews. We love summaries, but incomplete reviews with a manually added link will be removed.",
          },
          {
            heading: "Be yourself",
            info: "Your profile is your identity on Zomato, so keep it real. You're welcome to use a screen name (foodonym, maybe?), but please refrain from using inappropriate names, bios, or profile images. We want to stay clean, and we might end up removing your account depending on how inappropriate your profile is.",
          },
          {
            heading: "Don't misrepresent",
            info: "Identifying or promoting yourself as an official Zomato blogger, or using your status to solicit benefits in exchange for reviews on Zomato will not be tolerated. If reports or evidence of such instances are brought to our attention, we reserve the right to delete your Zomato profile, no questions asked.If you are a part of Zomato’s influencer program, we will restrict your review activity for the restaurants that you are partnering with, for the program. While we do love your work, letting you review those restaurants will not fit well with the Neutrality guidelines.If reports or evidence of threat, misrepresentation or such instances are brought to our attention, we reserve the right to delete your Zomato profile or take any other action that we may deem fit, no questions asked.",
          },
          {
            heading: "Don’t be a bully",
            info: "We take allegations of blackmail or threatening behaviour against restaurants and its associates very seriously. This activity is strictly against our guidelines and may also be illegal in many locations. Reviews submitted in an attempt to blackmail a restaurant and its associates will be deleted.",
          },
          {
            heading: "Play by the rules",
            info: "The content you add should be in compliance with Zomato's Terms and Conditions, including terms and conditions of any of Zomato products such as Zomato Pro, Online Ordering, or Zopay, as well as the prevailing local laws and regulations. Local laws take precedence, and content may be moderated or deleted to adhere to these.",
          },
          {
            heading: "Photo guidelines",
            info: "There's no easier way to show how deliciously chocolate-y that chocolate mud cake was than with a picture, right? That said, it's important to keep in mind our photo guidelines, and understand why some photos may be moved or removed once they've been added.Food shots that are clear, in focus, and delicious enough to make the viewer wish Zomato included smell-o-vision will be featured in restaurants' photo galleries. Ambiance shots that highlight the overall feel or vibe of a place will also be highlighted on restaurant pages.Photos that don't make the cut to appear on a restaurant's page, will show with your review or on your profile depending on how useful it is to other users and how relevant it is to the review. Photos with hair and bugs will be shown only with a review for validation and context.Violation of the below mentioned pointers may lead to deduction of foodie points, reduced visibility or deletion of your pictures",
            list: [
              "Photos that are exact duplicates of other photos, multiple clicks of the same dish or ambiance or taken from a different angles",
              "Plagiarized photos",
              "Photos of others posted without their permission",
              "Photos that contain promotional content",
              "Photos that contain subjects such as people in them",
              "Photos that are blurry or unclear",
              "Photos that contain text or are not related to dine-in experience",
              "Photos of half-eaten food items",
              "Photos of packed food items/packaging",
              "Photos of food under preparation",
              "Photos containing watermarks or write-ups of any kind",
              "Photos containing and focusing on subjects other than food or restaurant ambiance",
              "Unpleasant photos that ruin people's appetites",
            ],
          },
          {
            heading: "Guidelines for Restaurants",
            info: "Zomato is a great way for restaurants to reach out to a vast foodie community. A few things you should keep in mind:",
            list: [
              "Keep your listing updated: While our team makes every effort to keep information on Zomato up-to-date, we appreciate you letting us know when an update is required. If your timings change and your listing is not updated, customers arriving late won't be too happy with you (or Zomato).",
              "Don't solicit reviews: The best way to get reviews is to delight customers with your food and service. Selective solicitation is a strict NO, and offering any type of compensation or kick-back for reviews is unfair, so you definitely want to keep away from that, too.",
              "Don’t ever offer freebies, discounts, or payment in exchange for reviews.",
              "Don't offer incentives for users to remove reviews.",
              "Don’t ask your staff to compete with each other to collect reviews.",
              "Don’t work with companies or third-party vendors/PR agencies offering to 'fix your reviews/ratings'.",
              "While conducting foodie meetups is allowed, reviews which come in lieu of these official gatherings must carry a clear disclaimer which will help the others identify that the review is based on an invite. That being said, an invite certainly does not mean that the user needs to post a positive review.",
              "The businesses that do best on Zomato are the ones that provide a great customer experience to everyone who walks in the door without any expectation or encouragement that they write a positive review.",
              "If we do come across any evidence (direct/indirect) of you indulging in solicitation, we will activate a disclaimer on your restaurant's page, informing the Zomato community that your reviews are suspicious.",
              "Respond to criticism positively: Take two deep breaths when you get a negative review. Three, if required. This happens to all restaurants who have customers. These customers are always right, even when they are wrong. Take the unflattering reviews as constructive feedback and use it as an opportunity to fix things. Whether you agree with the feedback or not, take the criticism in good stride. You can reply with a management response to show you care, but please don't use this as a platform to hit back or offer the customer an incentive to edit their review. Your response can't be edited after posting, so choose your words well.",
              "Be accountable: Zomato will not moderate any questionable activities about your restaurant posted in reviews (e.g. serving shisha where it is not permitted, serving alcohol to minors, or staying open later than permitted). Zomato may also not moderate or delete any reviews where any third-party service provider is involved. Such a review may be retained if it falls within our guidelines. This business requires thick skin – stating the perceived attitude of owners or employees and reporting of individual actions are not considered personal attacks.",
              "Don't entertain: Fulfilling the demands of customers who ask for benefits at the threat of bad reviews or ratings sends a message that this behavior is tolerated. Similarly, inviting users who have reviewed and given a low rating back to the restaurant for a complimentary meal invites false negative reviews. These issues affect the entire community and require everyone's participation to curb their prevalence. Please report users who engage in such activities to help@zomato.com.",
              "In a concerted effort to maintain the neutrality of content on Zomato, restaurant owners, employees, and any affiliates with business interests are no longer permitted to write reviews on Zomato. We understand that being in the restaurant industry, you are truly passionate about food, and would love to share your experiences. But when you're unavoidably invested in your business, it becomes hard to leave emotions (and bias) at the door. This is a step towards maintaining neutrality - and quality - of the content on Zomato.",
              "It's also important to note that we (Zomato) have no employees or affiliates who are paid to review. If any guest identifies themselves as an official blogger, review employee, or associate of Zomato, it's not true. Employees of Zomato are contractually and ethically forbidden from using their status to solicit free meals or receive special treatment. If you observe any such practice, report it to help@zomato.com. Appropriate action will be taken against the user or employee if evidence can be provided.",
            ],
          },
          {
            heading: "Zomato Employee Code of Ethics",
            info: "Employees of Zomato are expected to adhere to and uphold the highest standard of ethics and integrity. This includes acting in accordance with our core values and the below listed policies at all times. Zomato employees are prohibited from using their employee status to solicit discounts, freebies, or special treatment at restaurants. Unless visiting a restaurant for official business, Zomato employees are to refrain from identifying themselves as employees of Zomato.All Zomato employees in client facing roles including but not limited to Sales, Sales Support, Neutrality, Media Content and Client Servicing across all transaction/ business/function at Zomato are prohibited from writing reviews and/or giving ratings for dine out experiences on Zomato from either their personal or Zomato accounts. They are also not permitted to influence others to write biased reviews or give ratings.Zomato's review and photo moderators are required to always act in favor of keeping Zomato a neutral platform. They are required to use their best judgement in implementing moderation guidelines and are prohibited from giving preferential treatment to restaurants. Deleting any authentic review from a restaurant page is in violation of our policies. Similarly, keeping reviews, which are proven to be unauthentic, is in violation of our policies.",
          },
        ],
      },
    },
    {
      index: "Privacy Policy",
      content:
        "Zomato Limited (Formerly known as Zomato Private Limited and Zomato Media Private Limited) and/or its affiliates (Zomato, the Company, we,us, and our,) respect your privacy and is committed to protecting it through its compliance with its privacy policies. This policy describes:\n\n the types of information that Zomato may collect from you when you access or use its websites, applications and other online services (collectively, referred as Services);\n\n andits practices for collecting, using, maintaining, protecting and disclosing that information.\n\nThis policy applies only to the information Zomato collects through its Services, in email, text and other electronic communications sent through or in connection with its Services.\n\n This policy DOES NOT apply to information that you provide to, or that is collected by, any third-party, such as restaurants at which you make reservations and/or pay through Zomato's Services and social networks that you use in connection with its Services. Zomato encourages you to consult directly with such third-parties about their privacy practices.\n\n Please read this policy carefully to understand Zomato's policies and practices regarding your information and how Zomato will treat it. By accessing or using its Services and/or registering for an account with Zomato, you agree to this privacy policy and you are consenting to Zomato's collection, use, disclosure, retention, and protection of your personal information as described here. If you do not provide the information Zomato requires, Zomato may not be able to provide all of its Services to you.\n\nIf you reside in a country within the European Union/European Economic Area (EAA), Zomato Media Portugal, Unipessoal LDA , located at Avenida 24 de Julho, N 102-E, 1200-870, Lisboa, Portugal, will be the controller of your personal data provided to, or collected by or for, or processed in connection with our Services;\n\nIf you reside in United States of America, Zomato USA LLC, located at 7427 Matthews Mint Hill Rd., STE 105, #324, Mint Hill, NC 28227 will be the controller of your personal data provided to, or collected by or for, or processed in connection with our Services;If you reside in any other part of the world, Zomato Limited, located at Pioneer Square, Tower 1- Ground to 6th Floor and Tower 2- 1st and 2nd Floors, Near Golf Course Extension, Sector-62, Gurugram, Haryana - 122098, India will be the controller of your personal data provided to, or collected by or for, or processed in connection with our Services.\n\nYour data controller is responsible for the collection, use, disclosure, retention, and protection of your personal information in accordance with its privacy standards as well as any applicable national laws. Your data controller may transfer data to other members of Zomato as described in this Privacy Policy. Zomato may process and retain your personal information on its servers in India where its data centers are located, and/or on the servers of its third parties (in or outside India), having contractual relationships with Zomato.\n\n This policy may change from time to time, your continued use of Zomato's Services after it makes any change is deemed to be acceptance of those changes, so please check the policy periodically for updates. ",
      subsections: {
        heading: "",
        subheading: [
          {
            heading: "The information we collect and how we use it",
            info: "Zomato Limited (Zomato,the Company, we, us, and our) collects several types of information from and about users of our Services, including:",
            list: [
              "Your Personal Information(PI) - Personal Information is the information that can be associated with a specific person and could be used to identify that specific person whether from that data, or from the data and other information that we have, or is likely to have access to. We do not consider personal information to include information that has been made anonymous or aggregated so that it can no longer be used to identify a specific person, whether in combination with other information or otherwise.",
              "Information about your internet connection, the equipment you use to access our Services and your usage details.",
              "We collect this information:",
              "directly from you when you provide it to us; and/or",
              "automatically as you navigate through our Services (information collected automatically may include usage details, IP addresses and information collected through cookies, web beacons and other tracking technologies).",
            ],
          },
          {
            heading: "Information You Provide to Us",
            info: "The information we collect on or through our Services may include:",
            list: [
              "Your account information: Your full name, email address, postal code, password and other information you may provide with your account, such as your gender, mobile phone number and website. Your profile picture that will be publicly displayed as part of your account profile. You may optionally provide us with this information through third-party sign-in services such as Facebook and Google Plus. In such cases, we fetch and store whatever information is made available to us by you through these sign-in services.",
              "Your preferences: Your preferences and settings such as time zone and language.",
              "Your content: Information you provide through our Services, including your reviews, photographs, comments, lists, followers, the users you follow, current and prior restaurant reservation details, food ordering details and history, favorite restaurants, special restaurant requests, contact information of people you add to, or notify of, your restaurant reservations through our Services, names, and other information you provide on our Services, and other information in your account profile.",
              "Your searches and other activities: The search terms you have looked up and results you selected.",
              "Your browsing information: How long you used our Services and which features you used; the ads you clicked on",
              "Your communications: Communications between you and other users or merchants through our Services; your participation in a survey, poll, sweepstakes, contest or promotion scheme; your request for certain features (e.g., newsletters, updates or other products); your communication with us about employment opportunities posted to the services",
              "Your transactional information: If you make reservations or purchases through our Services, we may collect and store information about you to process your requests and automatically complete forms for future transactions, including (but not limited to) your phone number, address, email, billing information and credit or payment card information. This information may be shared with third-parties which assist in processing and fulfilling your requests, including PCI compliant payment gateway processors. When you submit credit or payment card information, we encrypt the information using industry standard technologies, as further described below under Payment Card Information. If you write reviews about businesses with which you conduct transactions through our Services, we may publicly display information that you transacted with those businesses.",
              "Your Public Posts: You also may provide information (such as ratings, reviews, tips, photos, comments, likes, bookmarks, friends, lists, etc.) to be published or displayed (hereinafter, posted) on publicly accessible areas of our Services, or transmitted to other users of our Services or third-parties (collectively, User Contributions). Your User Contributions are posted on and transmitted to others at your own risk. Although we limit access to certain pages, you may set certain privacy settings for such information by logging into your account profile. Please be aware that no security measures are perfect or impenetrable (see Security section below). Additionally, we cannot control the actions of other users of our Services with whom you may choose to share your User Contributions. Therefore, we cannot and do not guarantee that your User Contributions will not be viewed by unauthorized persons. We may display this information on the Services, share it with businesses, and further distribute it to a wider audience through third party sites and services. You should be careful about revealing any sensitive details about yourself in such postings.",
              "We use the information you provide to us to enhance the functionality and improve the quality of our Services, and to personalize your experience while using our Services. We also use this information to display relevant advertising, provide support to you, communicate with you, and comply with our legal obligations.",
            ],
          },
          {
            heading: "Information about Your Friends",
            info: "You have the option to request your friends to join the Services by providing their contact information. If you request a friend to join and connect with you on the Services, we will only use your friend's contact information to process your request.",
          },
          {
            heading: "Information about Your Messages",
            info: "If you exchange messages with others through the Services, we may store them in order to process and deliver them, allow you to manage them, and investigate possible violations of our Terms of Service and wrongdoing in connection with the Services. If you send information from the Services to your mobile device via SMS text message, we may log your phone number, phone carrier, and the date and time that the message was processed. Carriers may charge recipients for texts that they receive.",
          },
          {
            heading:
              "Information We Collect Through Automatic Data Collection Technologies",
            info: "We may automatically collect certain information about the computer or devices (including mobile devices) you use to access the Services, and about your use of the Services, even if you use the Services without registering or logging in.",
            list: [
              "Usage information: Details of your use of our Services, including traffic data, location data, logs and other communication data and the resources that you access and use on or through our Services",
              "Computer and device information: Information about your computer, Internet connection and mobile device, including your IP address, operating systems, platforms, browser type, other browsing information (connection, speed, connection type etc.), device type, device's unique device identifier, mobile network information and the device's telephone number.",
              "Stored information and files: Our applications also may access metadata and other information associated with other files stored on your mobile device. This may include, for example, photographs, audio and video clips, personal contacts and address book information.",
              "Location information: Our applications collect real-time information about the location of your device, as permitted by you.",
              "Last URL visited: The URL of the last web page you visited before visiting our websites.",
              "Mobile device IDs: Unique mobile device identifier (e.g. IDFA or other device IDs on Apple devices like the iPhone and iPad), if you're using our Services on a mobile device, we may use mobile device IDs (the unique identifier assigned to a device by the manufacturer), instead of cookies, to recognize you. We may do this to store your preferences and track your use of our applications. Unlike cookies, mobile device IDs cannot be deleted. Advertising companies may use device IDs to track your use of our applications, track the number of advertisements displayed, measure advertising performance and display advertisements that are more relevant to you. Analytics companies may use mobile device IDs to track your usage of our applications.",
              "Your preferences: Your preferences and settings such as time zone and language.",
              "Your activity on the Services: Information about your activity on the Services, such as your search queries, comments, domain names, search results selected, number of clicks, pages viewed and the order of those pages, how long you visited our Services, the date and time you used the Services, error logs, and other similar information.",
              "Mobile status: For mobile application users, the online or offline status of your application.",
              "Applications: If you use the Zomato application, Zomato may collect information about the presence and/ or absence and/ or details pertaining to other applications on your mobile phone. The applications we gather information for, may vary across categories including, without limitation, shopping, fashion, food and travel. This will help us understand you and your preferences better and enable Zomato to provide you with a personalized experience.",
            ],
          },
          {
            heading: "Precise Location Information and How to Opt Out",
            info: "When you use one of our location-enabled services (for example, when you access Services from a mobile device), we may collect and process information about your mobile device's GPS location (including the latitude, longitude or altitude of your mobile device) and the time the location information is recorded to customize the Services with location-based information and features (for example, to inform you about restaurants in your area or applicable promotions). Some of these services require your personal data for the feature to work and we may associate location data with your device ID and other information we hold about you. We keep this data for no longer than is reasonably necessary for providing services to you. If you wish to use the particular feature, you will be asked to consent to your data being used for this purpose. You can withdraw your consent at any time by disabling the GPS or other location-tracking functions on your device, provided your device allows you to do this. See your device manufacturer's instructions for further details.",
          },
          {
            heading: "Cookies and Other Electronic Tools",
            info: "We, and third parties with whom we partner, may use cookies, pixel tags, web beacons, mobile device IDs, flash cookies and similar files or technologies to collect and store information in respect to your use of the Services and third party websites. A cookie is a small text file that is stored on your computer that enables us to recognize you (for example, as a registered user) when you visit our website, store your preferences and settings, enhance your experience by delivering content and advertising specific to your interests, perform research and analytics, track your use of our Services, and assist with security and administrative functions. Cookies may be persistent or stored only during an individual session. To understand more about cookies, click here https://www.aboutcookies.org. A pixel tag (also called a web beacon or clear GIF) is a tiny graphic with a unique identifier, embedded invisibly on a webpage (or an online ad or email), and is used to count or track things like activity on a webpage or ad impressions or clicks, as well as to access cookies stored on users computers. Zomato uses pixel tags to measure the popularity of our various pages, features and services. We also may include web beacons in e-mail messages or newsletters to determine whether the message has been opened and for other analytics.\n\n Most browsers are set to automatically allow cookies. Please note it may be possible to disable some (but not all) cookies through your device or browser settings, but doing so may interfere with certain functionality on the Services. Major browsers provide users with various options when it comes to cookies. Users can usually set their browsers to block all third-party cookies (which are those set by third-party companies collecting information on websites operated by other companies), block all cookies (including first-party cookies such as the ones Zomato uses to collect search activity information about its users), or block specific cookies. To modify your cookie settings, please visit your browser's help settings. You will need to opt out on each browser and each device you use to access the Services. Flash cookies operate differently than browser cookies and cannot be removed or blocked via web browser settings. By using our Services with your browser set to accept cookies you are consenting to our use of cookies in the manner described in this section. For more information please read our Cookie Policy.\n\nThird parties whose products or services are accessible or advertised through the Services, including social media services, may also use cookies or similar tools, and we advise you to check their privacy policies for information about their cookies and other practices. We do not control the practices of such partners and their privacy policies govern their interactions with you.",
          },
          {
            heading: "Information from Third Parties",
            info: "We may collect, process and store your user ID associated with any social media account (such as your Facebook and Google account) that you use to sign into the Services or connect with or use with the Services. When you sign in to your account with your social media account information, or otherwise connect to your social media account with the Services, you consent to our collection, storage, and use, in accordance with this Privacy Policy, of the information that you make available to us through the social media interface. This could include, without limitation, any information that you have made public through your social media account, information that the social media service shares with us, or information that is disclosed during the sign-in process. Please see your social media provider's privacy policy and help center for more information about how they share information when you choose to connect your account.We may also obtain information about you from third parties such as partners, marketers, third-party websites, and researchers, and combine that information with information which we collect from or about you.",
          },
          {
            heading: "Anonymous or De-Identified Data",
            info: "We may anonymize and/or de-identify information collected from you through the Services or via other means, including via the use of third-party web analytic tools as described below. As a result, our use and disclosure of aggregated and/or de-identified information is not restricted by this Privacy Policy, and it may be used and disclosed to others without limitation.",
          },
          {
            heading: "How we use the information we collect",
            info: "We may also use your information to contact you about our own and third-party goods and services that may be of interest to you. If you do not want us to use your information in this way, please check the relevant box located on the form on which we collect your data and/or adjust your user preferences in your account profile.\n\nWe may use the information we have collected from you to enable us to display advertisements to our advertisers'/service providers' target audiences. Even though we do not disclose your personal information for these purposes without your consent, if you click on or otherwise interact with an advertisement, the advertiser may assume that you meet its target criteria.",
            list: [
              "We use the information we collect from and about you for a variety of purposes, including to:",
              "Process and respond to your queries",
              "Understand our users (what they do on our Services, what features they like, how they use them, etc.), improve the content and features of our Services (such as by personalizing content to your interests), process and complete your transactions, and make special offers.",
              "Administer our Services and diagnose technical problems.",
              "Send you communications that you have requested or that may be of interest to you by way of emails, or courier, or registered post, or telephone calls, or any other mode of communication. We may also share your preferences or the Services availed by you with your network followers on Zomato for marketing and other promotional activities of our Services.",
              "Send you questions from other users that you may be able to answer if you have registered with Zomato.",
              "Enable us to show you ads that are relevant to you.",
              "Generate and review reports and data about, and to conduct research on, our user base and Service usage patterns.",
              "Administer contests and sweepstakes.",
              "Provide you with customer support.",
              "Provide you with policies about your account.",
              "Carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.",
              "Notify you about changes to our Services.",
              "Allow you to participate in interactive features offered through our Services.",
              "In any other way we may describe when you provide the information.",
              "For any other purpose with your consent.",
            ],
          },
          {
            heading: "How we share the information we collect",
            info: "We may disclose personal information that we collect or you provide, as described in this privacy policy, in the following ways:",
          },
          {
            heading: "General Information Disclosures",
            info: "",
            list: [
              "To our subsidiaries and affiliates, which are entities under common ownership or control of our ultimate parent company Zomato Limited.",
              "To contractors, advertisers/service providers who are bound by contractual obligations to keep personal information confidential and use it only for the purposes for which we disclose it to them.",
              "To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution or other sale or transfer of some or all of Zomato's assets, whether as a going concern or as part of bankruptcy, liquidation or similar proceeding, in which personal information held by Zomato about the users of our Services are among the assets transferred.",
              "To third-parties to market their products or services to you if you have consented to receive the promotional updates. We contractually require these third-parties to keep personal information confidential and use it only for the purposes for which we disclose it to them.",
              "To fulfill the purpose for which you provide it.",
              "For any other purpose disclosed by us when you provide the information.",
              "Service Providers. We may share your information with outside vendors that we use for a variety of purposes, such as to send you communications via emails, messages or tele-call to inform you about our products that may be of interest to you, push notifications to your mobile device on our behalf, provide voice recognition services to process your spoken queries and questions, help us analyze use of our Services, and process and collect payments. Some of our products, services and databases are hosted by third party hosting services providers. We also may use vendors for other projects, such as conducting surveys or organizing sweepstakes for us. We may share information about you with these vendors only to enable them to perform their services.",
              "Legal Purposes. We may share your information when we believe in good faith that such sharing is reasonably necessary in order to investigate, prevent, or take action regarding possible illegal activities or to comply with legal process. We may also share your information to investigate and address threats or potential threats to the physical safety of any person, to investigate and address violations of this Privacy Policy or the Terms of Service, or to investigate and address violations of the rights of third parties and/or to protect the rights, property and safety of Zomato, our employees, users, or the public. This may involve the sharing of your information with law enforcement, government agencies, courts, and/or other organizations on account of legal request such as subpoena, court order or government demand to comply with the law.",
              "Social Networks. If you interact with social media features on our Services, such as the Facebook Like button, or use your social media credentials to log-in or post content, these features may collect information about your use of the Services, as well as post information about your activities on the social media service. Your interactions with social media companies are governed by their privacy policies.",
              "To enforce or apply our Terms of Use and other agreements, including for billing and collection purposes.",
              "If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of Zomato, our customers or others. This includes exchanging information with other companies and organizations for the purposes of fraud protection and credit risk reduction.",
              "Consent. We may share your information in any other circumstances where we have your consent.",
            ],
          },
          {
            heading: "Information Shared with Restaurants",
            info: "When you make a restaurant reservation or execute online food ordering transaction through our Services, your information is provided to us and to the restaurants with whom you choose to reserve. In order to facilitate your reservation and online food order processing, we provide your information to that restaurant in a similar manner as if you had made a reservation or food order directly with the restaurant. If you provide a mobile phone number, restaurants or Zomato may send you text messages regarding your reservation or order's delivery status. Some restaurants also require you to provide credit or debit card account information to secure your reservation. When you make a restaurant reservation or online food ordering transaction through our Services and/or make a payment to a restaurant through our Services, we may also share with the restaurants additional information, such as information about your dining preferences and history or information that we collect from third-parties.\n\nInformation you choose to share with a restaurant when you make a reservation and/or pay a restaurant through our Services may be used by the restaurant for its own purposes. We do not control the privacy practices of restaurants. Please contact the restaurant directly if you want to learn about its privacy practices.",
          },
          {
            heading: "Payment Card Information",
            info: "To use certain of our Services, such as to make reservations at certain restaurants and to make payments to certain restaurants, we may require credit or debit card account information. By submitting your credit or debit card account information through our Services, you expressly consent to the sharing of your information with restaurants, third-party payment processors, and other third-party service providers (including but not limited to vendors who provide fraud detection services to us and other third parties), and you further agree to the following terms:",
            list: [
              "When you use a credit or debit card to secure a reservation through our Sites, we provide your credit or debit card account information (including card number and expiration date) to our third-party payment service providers and the applicable restaurant.",
              "When you initially provide your credit or debit card account information through our Services in order to use our restaurant payment services, we provide your credit or debit card account information to our third-party payment service providers. As explained in our Terms of Use, these third parties may store your credit or debit card account information so you can use our restaurant payment services through our Services in the future.",
              "For information about the security of your credit or debit card account information, see the Security section below.",
            ],
          },
          {
            heading: "Analytics and tailored advertising",
            info: "To help us better understand your use of the Services, we may use third-party web analytics on our Services, such as Google Analytics. These service providers use the sort of technology described in the Automatically-Collected Information Section above. The information collected by this technology will be disclosed to or collected directly by these service providers, who use the information to evaluate our users' use of the Services. We also use Google Analytics as described in the following section. To prevent Google Analytics from collecting or using your information, you may install the Google Analytics Opt-Out Browser add-on.",
          },
          {
            heading: "Tailored Advertising",
            info: "Third parties whose products or services are accessible or advertised via the Services may also use cookies or similar technologies to collect information about your use of the Services. This is done in order to help them-",
            list: [
              "Inform, optimize, and serve ads based on past visits to our website and other sites and",
              "Report how our ad impressions, other uses of ad services, and interactions with these ad impressions and ad services are related to visits to our website. We also allow other third parties (e.g., ad networks and ad servers such as Google Analytics, OpenX, Pubmatic, DoubleClick and others) to serve tailored ads to you on the Services, and to access their own cookies or similar technologies on your computer, mobile phone, or other device you use to access the Services. We neither have access to, nor does this Privacy Policy govern, the use of cookies or other tracking technologies that may be placed by such third parties. These parties may permit you to opt out of ad targeting. If you are interested in more information about tailored browser advertising and how you can generally control cookies from being put on your computer to deliver tailored advertising (i.e., not just for the Services), you may visit the Network Advertising Initiative's Consumer Opt-Out Link, and/or the Digital Advertising Alliance's Consumer Opt-Out Link to opt-out of receiving tailored advertising from companies that participate in those programs. To opt out of Google Analytics for Display Advertising or customize Google Display Network ads, you can visit the Google Ads Settings page. Please note that to the extent advertising technology is integrated into the Services, you may still receive ads even if you opt-out of tailored advertising. In that case, the ads will just not be tailored to your interests. Also, we do not control any of the above opt-out links and are not responsible for any choices you make using these mechanisms or the continued availability or accuracy of these mechanisms.",
              "When accessing the Services from a mobile application you may also receive tailored in-application advertisements. Each operating system: iOS, Android and Windows Phone provides its own instructions on how to prevent the delivery of tailored in-application advertisements. You may review the support materials and/or the privacy settings for the respective operating systems in order to opt-out of tailored in-application advertisements. For any other devices and/or operating systems, please visit the privacy settings for the applicable device or operating system or contact the applicable platform operator.",
            ],
          },
          {
            heading: "Choices about how we use and disclose your information",
            info: "We strive to provide you with choices regarding the personal information you provide to us. You can set your browser or mobile device to refuse all or some browser cookies, or to alert you when cookies are being sent. To learn how you can manage your Flash cookie settings, visit the Flash player settings page on Adobe's website. If you disable or refuse cookies, please note that some parts of our Services may then be inaccessible or not function properly.",
          },
          {
            heading: "Communication choices",
            info: "When you sign up for an account, you are opting in to receive emails from other Zomato users, businesses, and Zomato itself. You can log in to manage your email preferences and follow the unsubscribe instructions in commercial email messages, but note that you cannot opt out of receiving certain administrative policy, service policy, or legal policy from Zomato.",
          },
          {
            heading: "Reviewing, changing or deleting information",
            info: "If you would like to review, change or delete personal information we have collected from you, or permanently delete your account, please use the Contact Us link at the bottom of every page (also located here), or contact the Zomato Data Protection Officer (DPO).\n\nIf you delete your User Contributions from our websites, copies of your User Contributions may remain viewable in cached and archived pages, or might have been copied or stored by other users of our websites. Proper access and use of information provided on our websites, including User Contributions, is governed by our Terms of Use",
          },
          {
            heading: "Accessing & correcting your personal information",
            info: "We will take reasonable steps to accurately record the personal information that you provide to us and any subsequent updates.\n\nWe encourage you to review, update, and correct the personal information that we maintain about you, and you may request that we delete personal information about you that is inaccurate, incomplete, or irrelevant for legitimate purposes, or are being processed in a way which infringes any applicable legal requirement.\n\nYour right to review, update, correct, and delete your personal information may be limited, subject to the law of your jurisdiction:",
            list: [
              "If your requests are abusive or unreasonably excessive,",
              "Where the rights or safety of another person or persons would be encroached upon, or",
              "If the information or material you request relates to existing or anticipated legal proceedings between you and us, or providing access to you would prejudice negotiations between us or an investigation of possible unlawful activity. Your right to review, update, correct, and delete your information is subject to our records retention policies and applicable law, including any statutory retention requirements.",
            ],
          },
          {
            heading: "Security: How we protect your information",
            info: "We have implemented appropriate physical, electronic, and managerial procedures to safeguard and help prevent unauthorized access to your information and to maintain data security. These safeguards take into account the sensitivity of the information that we collect, process and store and the current state of technology. We follow generally accepted industry standards to protect the personal information submitted to us, both during transmission and once we receive it. The third party service providers with respect to payment gateway and payment processing are all validated as compliant with the payment card industry standard (generally referred to as PCI compliant service providers).\n\nWe assume no liability or responsibility for disclosure of your information due to errors in transmission, unauthorized third-party access, or other causes beyond our control. You play an important role in keeping your personal information secure. You should not share your user name, password, or other security information for your Zomato account with anyone. If we receive instructions using your user name and password, we will consider that you have authorized the instructions.",
          },
          {
            heading: "Permissible Age",
            info: "The Services are not intended for users under the age of 18, unless permitted under applicable local laws (Permissible Age). We do not knowingly collect any personal information from users or market to or solicit information from anyone under the Permissible Age. If we become aware that a person submitting personal information is under the Permissible Age, we will delete the account and any related information as soon as possible. If you believe we might have any information from or about a user under the Permissible Age, please contact us at privacy@zomato.com.",
          },
          {
            heading: "Third party links and services",
            info: "The Services may contain links to third-party websites. Your use of these features may result in the collection, processing or sharing of information about you, depending on the feature. Please be aware that we are not responsible for the content or privacy practices of other websites or services which may be linked on our services. We do not endorse or make any representations about third-party websites or services. Our Privacy Policy does not cover the information you choose to provide to or that is collected by these third parties. We strongly encourage you to read such third parties' privacy policies.",
          },
          {
            heading: "Changes to this privacy policy",
            info: "We reserve the right to amend this Privacy Policy from time to time to reflect changes in the law, our data collection and use practices, the features of our services, or advances in technology. Please check this page periodically for changes. Use of information we collect is subject to the Privacy Policy in effect at the time such information is used. If we make any material changes to this Privacy Policy, we will post the changes here. Please review the changes carefully. Your continued use of the Services following the posting of changes to this Privacy Policy will constitute your consent and acceptance of those changes.",
          },
          {
            heading: "Contact Us",
            info: "If you have any queries relating to the processing/ usage of information provided by you or Zomato's Privacy Policy, you may email the Data Protection Officer (DPO) at privacy@zomato.com or write to us at the following address.",
          },
        ],
      },
    },
    {
      index: "Terms of Service",
      content: "",
      subsections: {
        heading: "",
        subheading: [
          {
            heading: "Acceptance of terms",
            info: "Thank you for using Zomato. These Terms of Service (the Terms) are intended to make you aware of your legal rights and responsibilities with respect to your access to and use of the Zomato website at www.zomato.com (the Site) and any related mobile or software applications (Zomato Platform) including but not limited to delivery of information via the website whether existing now or in the future that link to the Terms (collectively, the Services).\n\n These Terms are effective for all existing and future Zomato customers, including but without limitation to users having access to 'restaurant business page' to manage their claimed business listings.\n\nPlease read these Terms carefully. By accessing or using the Zomato Platform, you are agreeing to these Terms and concluding a legally binding contract with Zomato Limited (formerly known as Zomato Private Limited and Zomato Media Private Limited) and/or its affiliates (excluding Zomato Foods Private Limited) (hereinafter collectively referred to as Zomato). You may not use the Services if you do not accept the Terms or are unable to be bound by the Terms. Your use of the Zomato Platform is at your own risk, including the risk that you might be exposed to content that is objectionable, or otherwise inappropriate.\n\nIn order to use the Services, you must first agree to the Terms. You can accept the Terms by:",
            list: [
              "Clicking to accept or agree to the Terms, where it is made available to you by Zomato in the user interface for any particular Service; or",
              "Actually using the Services. In this case, you understand and agree that Zomato will treat your use of the Services as acceptance of the Terms from that point onwards.",
            ],
          },
          {
            heading: "II. Definitions \n\n Customer",
            info: "Customer or You or Your refers to you, as a customer of the Services. A customer is someone who accesses or uses the Services for the purpose of sharing, displaying, hosting, publishing, transacting, or uploading information or views or pictures and includes other persons jointly participating in using the Services including without limitation a user having access to 'restaurant business page' to manage claimed business listings or otherwise.",
          },
          {
            heading: "Content",
            info: "Content will include (but is not limited to) reviews, images, photos, audio, video, location data, nearby places, and all other forms of information or data. Your content or Customer Content means content that you upload, share or transmit to, through or in connection with the Services, such as likes, ratings, reviews, images, photos, messages, chat communication, profile information, or any other materials that you publicly display or displayed in your account profile. Zomato Content means content that Zomato creates and make available in connection with the Services including, but not limited to, visual interfaces, interactive features, graphics, design, compilation, computer code, products, software, aggregate ratings, reports and other usage-related data in connection with activities associated with your account and all other elements and components of the Services excluding Your Content and Third Party Content. Third Party Content means content that comes from parties other than Zomato or its Customers, such as Restaurant Partners and is available on the Services",
          },
          {
            heading: "Restaurant(s)",
            info: "Restaurant means the restaurants listed on Zomato Platform.",
          },
          {
            heading: "III.Eligibility to use the services",
            info: "",
            list: [
              "You hereby represent and warrant that you are at least eighteen (18) years of age or above and are fully able and competent to understand and agree the terms, conditions, obligations, affirmations, representations, and warranties set forth in these Terms.",
              "Compliance with Laws. You are in compliance with all laws and regulations in the country in which you live when you access and use the Services. You agree to use the Services only in compliance with these Terms and applicable law, and in a manner that does not violate our legal rights or those of any third party(ies).",
            ],
          },
          {
            heading: "IV. Changes to the terms",
            info: "Zomato may vary or amend or change or update these Terms, from time to time entirely at its own discretion. You shall be responsible for checking these Terms from time to time and ensure continued compliance with these Terms. Your use of Zomato Platform after any such amendment or change in the Terms shall be deemed as your express acceptance to such amended/changed terms and you also agree to be bound by such changed/amended Terms.",
          },
          {
            heading: "V. Translation of the terms",
            info: "Zomato may provide a translation of the English version of the Terms into other languages. You understand and agree that any translation of the Terms into other languages is only for your convenience and that the English version shall govern the terms of your relationship with Zomato. Furthermore, if there are any inconsistencies between the English version of the Terms and its translated version, the English version of the Terms shall prevail over others.",
          },
          {
            heading: "VI. Provision of the services being offered by Zomato",
            info: "",
            list: [
              "Zomato is constantly evolving in order to provide the best possible experience and information to its Customers. You acknowledge and agree that the form and nature of the Services which Zomato provides, may require affecting certain changes in it, therefore, Zomato reserves the right to suspend/cancel, or discontinue any or all products or services at any time without notice, make modifications and alterations in any or all of its contents, products and services contained on the site without any prior notice.",
              "We, the software, or the software application store that makes the software available for download may include functionality to automatically check for updates or upgrades to the software. Unless your device, its settings, or computer software does not permit transmission or use of upgrades or updates, you agree that we, or the applicable software or software application store, may provide notice to you of the availability of such upgrades or updates and automatically push such upgrade or update to your device or computer from time-to-time. You may be required to install certain upgrades or updates to the software in order to continue to access or use the Services, or portions thereof (including upgrades or updates designed to correct issues with the Services). Any updates or upgrades provided to you by us under the Terms shall be considered part of the Services.",
              "You acknowledge and agree that if Zomato disables access to your account, you may be prevented from accessing the Services, your account details or any files or other content, which is contained in your account.",
              "In our effort to continuously improve the Zomato Platform and Services, we undertake research and conduct experiments from time to time on various aspects of the Services and offerings, including our apps, websites, user interface and promotional campaigns. As a result of which, some Customers may experience features differently than others at any given time. This is for making the Zomato Platform better, more convenient and easy to use, improving Customer experience, enhancing the safety and security of our services and offerings and developing new services and features.",
              "By using Zomato's Services you agree to the following disclaimers:",
              "The Content on these Services is for informational purposes only. Zomato disclaims any liability for any information that may have become outdated since the last time the particular piece of information was updated. Zomato reserves the right to make changes and corrections to any part of the Content on these Services at any time without prior notice. Zomato does not guarantee the quality of the Goods, the prices listed in menus or the availability of all menu items at any Restaurant/Merchant. Unless stated otherwise, all pictures and information contained on these Services are believed to be owned by or licensed to Zomato. Please email a takedown request (by using the Contact Us link on the home page) to the webmaster if you are the copyright owner of any Content on these Services and you think the use of the above material violates Your copyright in any way. Please indicate the exact URL of the webpage in your request. All images shown here have been digitized by Zomato. No other party is authorized to reproduce or republish these digital versions in any format whatsoever without the prior written permission of Zomato.",
              "Any certification, licenses or permits (Certification) or information in regard to such Certification that may be displayed on the Restaurant's listing page on the Zomato Platform is for informational purposes only. Such Certification is displayed by Zomato on an 'as available' basis that is provided to Zomato by the Restaurant partner(s)/Merchant(s). Zomato does not make any warranties about the validity, authenticity, reliability and accuracy of such Certification or any information displayed in this regard. Any reliance by a Customer upon the Certification or information thereto shall be strictly at such Customer's own risk and Zomato in no manner shall assume any liability whatsoever for any losses or damages in connection with the use of this information or for any inaccuracy, invalidity or discrepancy in the Certification or non-compliance of any applicable local laws or regulations by the Restaurant partner/Merchant.",
              "Zomato reserves the right to charge a subscription and/or membership fee in respect of any of its product or service and/or any other charge or fee on a per order level from Customers, in respect of any of its product or service on the Zomato Platform anytime in future.",
              "Zomato may from time to time introduce referral and/or incentive based programs for its Customers (Program). These Program(s) may be governed by their respective terms and conditions. By participating in the Program, Customers are bound by the Program terms and conditions as well as the Zomato Platform terms. Further, Zomato reserves the right to terminate / suspend the Customer's account and/or credits / points earned and/or participation of the Customer in the Program if Zomato determines in its sole discretion that the Customer has violated the rules of the Program and/or has been involved in activities that are in contravention of the Program terms and/or Zomato Platform terms or has engaged in activities which are fraudulent / unlawful in nature. Furthermore, Zomato reserves the right to modify, cancel and discontinue its Program without notice to the Customer.",
              "Zomato may from time to time offer to the Customers credits, promo codes, vouchers or any other form of cashback that Zomato may decide at its discretion. Zomato reserves the right to modify, convert, cancel and/or discontinue such credits, promo codes or vouchers, as it may deem fit.",
            ],
          },
          {
            heading: "VII. Use of services by you or Customer",
            info: "1. Zomato Customer Account Including 'Claim Your Business Listing' Access",
            list: [
              "a. You must create an account in order to use some of the features offered by the Services, including without limitation to 'claim your business listing' on the Services. Use of any personal information you provide to us during the account creation process is governed by our Privacy Policy. You must keep your password confidential and you are solely responsible for maintaining the confidentiality and security of your account, all changes and updates submitted through your account, and all activities that occur in connection with your account.",
              "b. You may also be able to register to use the Services by logging into your account with your credentials from certain third party social networking sites (e.g., Facebook). You confirm that you are the owner of any such social media account and that you are entitled to disclose your social media login information to us. You authorize us to collect your authentication information, and other information that may be available on or through your social media account consistent with your applicable settings and instructions.",
              "c. In creating an account and/or claiming your business' listing, you represent to us that all information provided to us in such process is true, accurate and correct, and that you will update your information as and when necessary in order to keep it accurate. If you are creating an account or claiming a business listing, then you represent to us that you are the owner or authorized agent of such business. You may not impersonate someone else, create or use an account for anyone other than yourself, provide an email address other than your own, create multiple accounts or business listings except as otherwise authorized by us, or provide or use false information to obtain access to a business' listing on the Services that you are not legally entitled to claim. You acknowledge that any false claiming of a business listing may cause Zomato or third parties to incur substantial economic damages and losses for which you may be held liable and accountable.",
              "d. You are also responsible for all activities that occur in your account. You agree to notify us immediately of any unauthorized use of your account in order to enable us to take necessary corrective action. You also agree that you will not allow any third party to use your Zomato account for any purpose and that you will be liable for such unauthorized access.",
              "e. By creating an account, you agree to receive certain communications in connection with Zomato Platform or Services. For example, you might receive comments from other Customers or other Customers may follow the activity to do on your account. You can opt-out or manage your preferences regarding non-essential communications through account settings.",
            ],
          },
          {
            heading: "2. Others Terms",
            info: "a. In order to connect you to certain restaurants, we provide value added telephony services through our phone lines, which are displayed on the specific restaurant listing page on the Zomato Platform, which connect directly to restaurants' phone lines. We record all information regarding this call including the voice recording of the conversation between you, and the restaurant (for internal billing tracking purposes and customer service improvement at the restaurant's end). If you do not wish that your information be recorded in such a manner, please do not use the telephone services provided by Zomato. You explicitly agree and permit Zomato to record all this information when you avail the telephony services through the Zomato provided phone lines on the Zomato Platform.",
            list: [
              "b. You agree to use the Services only for purposes that are permitted by (a) the Terms and (b) any applicable law, regulation or generally accepted practices or guidelines in the relevant jurisdictions.",
              "c. You agree to use the data owned by Zomato (as available on the Services or through any other means like API etc.) only for personal use/purposes and not for any commercial use (other than in accordance with 'Claim Your Business Listing' access) unless agreed to by/with Zomato in writing.",
              "d. You agree not to access (or attempt to access) any of the Services by any means other than the interface that is provided by Zomato, unless you have been specifically allowed to do so, by way of a separate agreement with Zomato. You specifically agree not to access (or attempt to access) any of the Services through any automated means (including use of scripts or web crawlers) and shall ensure that you comply with the instructions set out in any robots.txt file present on the Services.",
              "e. You agree that you will not engage in any activity that interferes with or disrupts the Services (or the servers and networks which are connected to the Services). You shall not delete or revise any material or information posted by any other Customer(s), shall not engage in spamming, including but not limited to any form of emailing, posting or messaging that is unsolicited.",
            ],
          },
          {
            heading: "How we share the information we collect",
            info: "We may disclose personal information that we collect or you provide, as described in this privacy policy, in the following ways:",
          },
          {
            heading: "VIII. Content",
            info: "1. Ownership of Zomato Content and Proprietary Rights",
            list: [
              "a. We are the sole and exclusive copyright owners of the Services and our Content. We also exclusively own the copyrights, trademarks, service marks, logos, trade names, trade dress and other intellectual and proprietary rights throughout the world (the IP Rights) associated with the Services and Zomato Content, which may be protected by copyright, patent, trademark and other applicable intellectual property and proprietary rights and laws. You acknowledge that the Services contain original works and have been developed, compiled, prepared, revised, selected, and arranged by us and others through the application of methods and standards of judgment developed and applied through the expenditure of substantial time, effort, and money and constitutes valuable intellectual property of us and such others. You further acknowledge that the Services may contain information which is designated as confidential by Zomato and that you shall not disclose such information without Zomato's prior written consent.",
              "b. You agree to protect Zomato's proprietary rights and the proprietary rights of all others having rights in the Services during and after the term of this agreement and to comply with all reasonable written requests made by us or our suppliers and licensors of content or otherwise to protect their and others' contractual, statutory, and common law rights in the Services. You acknowledge and agree that Zomato (or Zomato's licensors) own all legal right, title and interest in and to the Services, including any IP Rights which subsist in the Services (whether those rights happen to be registered or not, and wherever in the world those rights may exist). You further acknowledge that the Services may contain information which is designated as confidential by Zomato and that you shall not disclose such information without Zomato's prior written consent. Unless you have agreed otherwise in writing with Zomato, nothing in the Terms gives you a right to use any of Zomato's trade names, trademarks, service marks, logos, domain names, and other distinctive brand features.",
              "c. You agree not to use any framing techniques to enclose any trademark or logo or other proprietary information of Zomato; or remove, conceal or obliterate any copyright or other proprietary notice or source identifier, including without limitation, the size, colour, location or style of any proprietary mark(s). Any infringement shall lead to appropriate legal proceedings against you at an appropriate forum for seeking all available/possible remedies under applicable laws of the country of violation. You cannot modify, reproduce, publicly display or exploit in any form or manner whatsoever any of the Zomato's Content in whole or in part except as expressly authorized by Zomato.",
              "d. To the fullest extent permitted by applicable law, we neither warrant nor represent that your use of materials displayed on the Services will not infringe rights of third parties not owned by or affiliated with us. You agree to immediately notify us upon becoming aware of any claim that the Services infringe upon any copyright trademark, or other contractual, intellectual, statutory, or common law rights by following the instructions contained below in section XVI.",
            ],
          },
          {
            heading: "2. Your License to Zomato Content",
            info: "",
            list: [
              "a. We grant you a personal, limited, non-exclusive and non-transferable license to access and use the Services only as expressly permitted in these Terms. You shall not use the Services for any illegal purpose or in any manner inconsistent with these Terms. You may use information made available through the Services solely for your personal, non-commercial use. You agree not to use, copy, display, distribute, modify, broadcast, translate, reproduce, reformat, incorporate into advertisements and other works, sell, promote, create derivative works, or in any way exploit or allow others to exploit any of Zomato Content in whole or in part except as expressly authorized by us. Except as otherwise expressly granted to you in writing, we do not grant you any other express or implied right or license to the Services, Zomato Content or our IP Rights.",
              "b. Any violation by you of the license provisions contained in this Section may result in the immediate termination of your right to use the Services, as well as potential liability for copyright and other IP Rights infringement depending on the circumstances.",
            ],
          },
          {
            heading: "3. Zomato License to Your or Customer Content",
            info: "In consideration of availing the Services on the Zomato Platform and by submitting Your Content, you hereby irrevocably grant Zomato a perpetual, irrevocable, world-wide, non-exclusive, fully paid and royalty-free, assignable, sub-licensable and transferable license and right to use Your Content (including content shared by any business user having access to a 'restaurant business page' to manage claimed business listings or otherwise) and all IP Rights therein for any purpose including API partnerships with third parties and in any media existing now or in future. By use we mean use, copy, display, distribute, modify, translate, reformat, incorporate into advertisements and other works, analyze, promote, commercialize, create derivative works, and in the case of third party services, allow their users and others to do the same. You grant us the right to use the name or username that you submit in connection with Your Content. You irrevocably waive, and cause to be waived, any claims and assertions of moral rights or attribution with respect to Your Content brought against Zomato or its Customers, any third party services and their users.",
          },
          {
            heading: "4. Representations Regarding Your or Customer Content",
            info: "a. You are responsible for Your Content. You represent and warrant that you are the sole author of, own, or otherwise control all of the rights of Your Content or have been granted explicit permission from the rights holder to submit Your Content; Your Content was not copied from or based in whole or in part on any other content, work, or website; Your Content was not submitted via the use of any automated process such as a script bot; use of Your Content by us, third party services, and our and any third party users will not violate or infringe any rights of yours or any third party; Your Content is truthful and accurate; and Your Content does not violate the Guidelines and Policies or any applicable laws",
            list: [
              "b. If Your Content is a review, you represent and warrant that you are the sole author of that review; the review reflects an actual dining experience that you had; you were not paid or otherwise remunerated in connection with your authoring or posting of the review; and you had no financial, competitive, or other personal incentive to author or post a review that was not a fair expression of your honest opinion.",
              "c. You assume all risks associated with Your Content, including anyone's reliance on its quality, accuracy, or reliability, or any disclosure by you of information in Your Content that makes you personally identifiable. While we reserve the right to remove Content, we do not control actions or Content posted by our Customers and do not guarantee the accuracy, integrity or quality of any Content. You acknowledge and agree that Content posted by Customers and any and all liability arising from such Content is the sole responsibility of the Customer who posted the content, and not Zomato.",
            ],
          },
          {
            heading: "5. Content Removal",
            info: "We reserve the right, at any time and without prior notice, to remove, block, or disable access to any Content that we, for any reason or no reason, consider to be objectionable, in violation of the Terms or otherwise harmful to the Services or our Customers in our sole discretion. Subject to the requirements of applicable law, we are not obligated to return any of Your Content to you under any circumstances. Further, the Restaurant reserves the right to delete any images and pictures forming part of Customer Content, from such Restaurant's listing page at its sole discretion.",
          },
          {
            heading: "Choices about how we use and disclose your information",
            info: "We strive to provide you with choices regarding the personal information you provide to us. You can set your browser or mobile device to refuse all or some browser cookies, or to alert you when cookies are being sent. To learn how you can manage your Flash cookie settings, visit the Flash player settings page on Adobe's website. If you disable or refuse cookies, please note that some parts of our Services may then be inaccessible or not function properly.",
          },
          {
            heading: "6. Third Party Content and Links",
            info: "a. Some of the content available through the Services may include or link to materials that belong to third parties, such as third party reservation services or food delivery/ordering or dining out. Please note that your use of such third party services will be governed by the terms of service and privacy policy applicable to the corresponding third party. We may obtain business addresses, phone numbers, and other contact information from third party vendors who obtain their data from public sources.",
            list: [
              "b. We have no control over, and make no representation or endorsement regarding the accuracy, relevancy, copyright compliance, legality, completeness, timeliness or quality of any product, services, advertisements and other content appearing in or linked to from the Services. We do not screen or investigate third party material before or after including it on our Services.",
              "c. We reserve the right, in our sole discretion and without any obligation, to make improvements to, or correct any error or omissions in, any portion of the content accessible on the Services. Where appropriate, we may in our sole discretion and without any obligation, verify any updates, modifications, or changes to any content accessible on the Services, but shall not be liable for any delay or inaccuracies related to such updates. You acknowledge and agree that Zomato is not responsible for the availability of any such external sites or resources, and does not endorse any advertising, products or other materials on or available from such web sites or resources.",
              "d. Third party content, including content posted by our Customers or Restaurant Partners, does not reflect our views or that of our parent, subsidiary, affiliate companies, branches, employees, officers, directors, or shareholders. In addition, none of the content available through the Services is endorsed or certified by the providers or licensors of such third party content. We assume no responsibility or liability for any of Your Content or any third party content.",
              "e. You further acknowledge and agree that Zomato is not liable for any loss or damage which may be incurred by you as a result of the availability of those external sites or resources, or as a result of any reliance placed by you on the completeness, accuracy or existence of any advertising, products or other materials on, or available from, such websites or resources. Without limiting the generality of the foregoing, we expressly disclaim any liability for any offensive, defamatory, illegal, invasive, unfair, or infringing content provided by third parties",
            ],
          },
          {
            heading: "7. Customer Reviews",
            info: "a. Customer reviews or ratings for Restaurants do not reflect the opinion of Zomato. Zomato receives multiple reviews or ratings for Restaurants by Customers, which reflect the opinions of the Customers. It is pertinent to state that each and every review posted on Zomato is the personal opinion of the Customer/reviewer only. Zomato is a neutral platform, which solely provides a means of communication between Customers/reviewers including Customers or restaurant owners/representatives with access to restaurant business page. The advertisements published on the Zomato Platform are independent of the reviews received by such advertisers.",
            list: [
              "b. We are a neutral platform and we don't arbitrate disputes, however in case if someone writes a review that the restaurant does not consider to be true, the best option for the restaurant representative would be to contact the reviewer or post a public response in order to clear up any misunderstandings. If the Restaurant believes that any particular Customer's review violates any of the Zomato' policies, the restaurant may write to us at neutrality@zomato.com and bring such violation to our attention. Zomato may remove the review in its sole discretion if review is in violation of the Terms, or content guidelines and policies or otherwise harmful to the Services",
            ],
          },
          { heading: "IX. Content guidelines and privacy policy", info: "" },
          {
            heading: "1. Content Guidelines",
            info: "You represent that you have read, understood and agreed to our Guidelines and Polices related to Content",
          },
          {
            heading: "2. Privacy Policy",
            info: "You represent that you have read, understood and agreed to our Privacy Policy. Please note that we may disclose information about you to third parties or government authorities if we believe that such a disclosure is reasonably necessary to (i) take action regarding suspected illegal activities; (ii) enforce or apply our Terms and Privacy Policy; (iii) comply with legal process or other government inquiry, such as a search warrant, subpoena, statute, judicial proceeding, or other legal process/notice served on us; or (iv) protect our rights, reputation, and property, or that of our Customers, affiliates, or the general public",
          },
          {
            heading: "X. Restrictions on use",
            info: "Without limiting the generality of these Terms, in using the Services, you specifically agree not to post or transmit any content (including review) or engage in any activity that, in our sole discretion:",
            list: [
              "a. Violate our Guidelines and Policies;",
              "b. Is harmful, threatening, abusive, harassing, tortious, indecent, defamatory, discriminatory, vulgar, profane, obscene, libellous, hateful or otherwise objectionable, invasive of another's privacy, relating or encouraging money laundering or gambling;",
              "c. Constitutes an inauthentic or knowingly erroneous review, or does not address the goods and services, atmosphere, or other attributes of the business you are reviewing.",
              "d. Contains material that violates the standards of good taste or the standards of the Services;",
              "e. Violates any third-party right, including, but not limited to, right of privacy, right of publicity, copyright, trademark, patent, trade secret, or any other intellectual property or proprietary rights;",
              "f. Accuses others of illegal activity, or describes physical confrontations;",
              "g. Alleges any matter related to health code violations requiring healthcare department reporting. Refer to our Guidelines and Policies for more details about health code violations.",
              "h. Is illegal, or violates any federal, state, or local law or regulation (for example, by disclosing or trading on inside information in violation of securities law);",
              "i. Attempts to impersonate another person or entity;",
              "j. Disguises or attempts to disguise the origin of Your Content, including but not limited to by: (i) submitting Your Content under a false name or false pretences; or (ii) disguising or attempting to disguise the IP address from which Your Content is submitted;",
              "k. Constitutes a form of deceptive advertisement or causes, or is a result of, a conflict of interest;",
              "l. Is commercial in nature, including but not limited to spam, surveys, contests, pyramid schemes, postings or reviews submitted or removed in exchange for payment, postings or reviews submitted or removed by or at the request of the business being reviewed, or other advertising materials;",
              "m. Asserts or implies that Your Content is in any way sponsored or endorsed by us;",
              "n. Contains material that is not in English or, in the case of products or services provided in foreign languages, the language relevant to such products or services;",
              "o. Falsely states, misrepresents, or conceals your affiliation with another person or entity;",
              "p. Accesses or uses the account of another customer without permission;",
              "q. Distributes computer viruses or other code, files, or programs that interrupt, destroy, or limit the functionality of any computer software or hardware or electronic communications equipment;",
              "r. Interferes with, disrupts, or destroys the functionality or use of any features of the Services or the servers or networks connected to the Services;",
              "s. Hacks or accesses without permission our proprietary or confidential records, records of another Customer, or those of anyone else;",
              "t. Violates any contract or fiduciary relationship (for example, by disclosing proprietary or confidential information of your employer or client in breach of any employment, consulting, or non-disclosure agreement);",
              "u. Decompiles, reverse engineers, disassembles or otherwise attempts to derive source code from the Services;",
              "v. Removes, circumvents, disables, damages or otherwise interferes with security-related features, or features that enforce limitations on use of, the Services;",
              "w. Violates the restrictions in any robot exclusion headers on the Services, if any, or bypasses or circumvents other measures employed to prevent or limit access to the Services;",
              "x. Collects, accesses, or stores personal information about other Customers of the Services;",
              "y. Is posted by a bot;",
              "z. Harms minors in any way;",
              "aa. Threatens the unity, integrity, defense, security or sovereignty of India or of the country of use, friendly relations with foreign states, or public order or causes incitement to the commission of any cognizable offence or prevents investigation of any offence or is insulting any other nation;",
              "ab. Modifies, copies, scrapes or crawls, displays, publishes, licenses, sells, rents, leases, lends, transfers or otherwise commercialize any rights to the Services or Our Content; or",
              "ac. Attempts to do any of the foregoing.",
              "ad. is patently false and untrue, and is written or published in any form, with the intent to mislead or harass a person, entity or agency for financial gain or to cause any injury to any person;",
              "You acknowledge that Zomato has no obligation to monitor your – or anyone else's – access to or use of the Services for violations of the Terms, or to review or edit any content. However, we have the right to do so for the purpose of operating and improving the Services (including without limitation for fraud prevention, risk assessment, investigation and customer support purposes), to ensure your compliance with the Terms and to comply with applicable law or the order or requirement of legal process, a court, consent decree, administrative agency or other governmental body",
              "You hereby agree and assure Zomato that the Zomato Platform/Services shall be used for lawful purposes only and that you will not violate laws, regulations, ordinances or other such requirements of any applicable Central, Federal State or local government or international law(s). You shall not upload, post, email, transmit or otherwise make available any unsolicited or unauthorized advertising, promotional materials, junk mail, spam mail, chain letters or any other form of solicitation, encumber or suffer to exist any lien or security interest on the subject matter of these Terms or to make any representation or warranty on behalf of Zomato in any form or manner whatsoever.",
              "You hereby agree and assure that while communicating on the Zomato Platform including but not limited to giving cooking instructions to the Restaurants, communicating with our support agents on chat support or with the Delivery Partners, through any medium, You shall not use abusive and derogatory language and/or post any objectionable information that is unlawful, threatening, defamatory, or obscene. In the event you use abusive language and/or post objectionable information, Zomato reserves the right to suspend the chat support service and/or block your access and usage of the Zomato Platform, at any time with or without any notice.",
              "Any Content uploaded by you, shall be subject to relevant laws of India and of the country of use and may be disabled, or and may be subject to investigation under applicable laws. Further, if you are found to be in non-compliance with the laws and regulations, these terms, or the privacy policy of the Zomato Platform, Zomato shall have the right to immediately block your access and usage of the Zomato Platform and Zomato shall have the right to remove any non-compliant content and or comment forthwith, uploaded by you and shall further have the right to take appropriate recourse to such remedies as would be available to it under various statutes.",
            ],
          },
          {
            heading: "XI. Customer feedback",
            info: "",
            list: [
              "If you share or send any ideas, suggestions, changes or documents regarding Zomato's existing business (Feedback), you agree that (i) your Feedback does not contain the confidential, secretive or proprietary information of third parties, (ii) Zomato is under no obligation of confidentiality with respect to such Feedback, and shall be free to use the Feedback on an unrestricted basis (iii) Zomato may have already received similar Feedback from some other Customer or it may be under consideration or in development, and (iv) By providing the Feedback, you grant us a binding, non-exclusive, royalty-free, perpetual, global license to use, modify, develop, publish, distribute and sublicense the Feedback, and you irrevocably waive, against Zomato and its Customers any claims/assertions, whatsoever of any nature, with regard to such Feedback.",
              "Please provide only specific Feedback on Zomato's existing products or marketing strategies; do not include any ideas that Zomato's policy will not permit it to accept or consider.",
              "Notwithstanding the abovementioned clause, Zomato or any of its employees do not accept or consider unsolicited ideas, including ideas for new advertising campaigns, new promotions, new or improved products or technologies, product enhancements, processes, materials, marketing plans or new product names. Please do not submit any unsolicited ideas, original creative artwork, suggestions or other works (Submissions) in any form to Zomato or any of its employees.",
              "The purpose of this policy is to avoid potential misunderstandings or disputes when Zomato's products or marketing strategies might seem similar to ideas submitted to Zomato. If, despite our request to not send us your ideas, you still submit them, then regardless of what your letter says, the following terms shall apply to your Submissions.",
              "Terms of Idea Submission\n\nYou agree that: (1) your Submissions and their Contents will automatically become the property of Zomato, without any compensation to you; (2) Zomato may use or redistribute the Submissions and their contents for any purpose and in any way; (3) there is no obligation for Zomato to review the Submission; and (4) there is no obligation to keep any Submissions confidential.",
            ],
          },
          {
            heading: "XII. Advertising",
            info: "Some of the Services are supported by advertising revenue and may display advertisements and promotions. These advertisements may be targeted to the content of information stored on the Services, queries made through the Services or other information. The manner, mode and extent of advertising by Zomato on the Services are subject to change without specific notice to you. In consideration for Zomato granting you access to and use of the Services, you agree that Zomato may place such advertising on the Services.",
            list: [
              "Part of the site may contain advertising information or promotional material or other material submitted to Zomato by third parties or Customers. Responsibility for ensuring that material submitted for inclusion on the Zomato Platform or mobile apps complies with applicable international and national law is exclusively on the party providing the information/material. Your correspondence or business dealings with, or participation in promotions of, advertisers other than Zomato found on or through the Zomato Platform and or mobile apps, including payment and delivery of related goods or services, and any other terms, conditions, warranties or representations associated with such dealings, shall be solely between you and such advertiser. Zomato will not be responsible or liable for any error or omission, inaccuracy in advertising material or any loss or damage of any sort incurred as a result of any such dealings or as a result of the presence of such other advertiser(s) on the Zomato Platform and mobile application.",
              "For any information related to a charitable campaign (Charitable Campaign) sent to Customers and/or displayed on the Zomato Platform where Customers have an option to donate money by way of (a) payment on a third party website; or (b) depositing funds to a third party bank account, Zomato is not involved in any manner in the collection or utilization of funds collected pursuant to the Charitable Campaign. Zomato does not accept any responsibility or liability for the accuracy, completeness, legality or reliability of any information related to the Charitable Campaign. Information related to the Charitable Campaign is displayed for informational purposes only and Customers are advised to do an independent verification before taking any action in this regard.",
            ],
          },
        ],
      },
    },
    {
      index: "API Policy",
      content:
        "By accepting these License Agreement Terms of Use (“License Agreement”) you and your controlled affiliates, where applicable, agree to enter into a legally binding agreement (“Agreement”) with Zomato Limited (Formerly known as Zomato Private Limited and Zomato Media Private Limited) and its affiliates (collectively, “Zomato”) regarding use of Zomato's Licensed Content, Marks (each as defined below) and application programming interface (“API”). The following terms shall govern your use of API and relationship with Zomato.",
      subsections: {
        heading: "Account Creation",
        subheading: [
          {
            heading: "",
            info: "You must create an account in order to use Zomato’s Licensed Content, Marks and API. To create an account, you will be asked to provide certain basic information. This information may include your name, address, company/organization, telephone number and email address. Such information will be held and used by Zomato in accordance with Zomato’s privacy policy, which governs the use of any personal information provided by you to Zomato.",
          },
          {
            heading: "Purpose",
            info: "This License Agreement governs your use of Licensed Content and Marks, API licensed to you pursuant to the terms hereto, and any accompanying or related documentation, source code, executable applications and other materials Zomato determines to provide to you in the development or operation of your website and / or mobile application (“Developer Platform”).",
          },
          {
            heading: "Grant of License",
            info: "",
            list: [
              "License to Content: Subject to the terms and conditions of this License Agreement and the License Content Usage Guidelines, Zomato hereby grants you a non-transferable, non-exclusive, revocable, non-sublicensable, royalty-free right and license to (i) use, perform and display (publicly or otherwise) the Licensed Content in your applications (the “Developer Application”) on the Developer Platform, and (ii) allow users of the Developer Platform (“Users”) to access the Licensed Content using the Developer Applications on the Developer Platform.",
              "Licensed Content: Licensed Content shall include such restaurant information as may be provided by Zomato at its sole discretion from time to time. The Licensed Content shall be shared with you on a real time basis and you will be permitted to make a maximum of thousand (1000) calls to the API per day to access the Licensed Content. Zomato hereby reserves the right to modify, change, or delete any of the Licensed Content and API, including but not limited to alter, modify, change or delete the terms of this License Agreement, from time to time, at its sole discretion. Further, any modification, change or deletion made by Zomato to the Licensed Content, API or this License Agreement shall be applicable to you. If you do not wish to be bound to any new modification introduced by Zomato to the Licensed Content, API or this License Agreement, you must terminate this License Agreement be ceasing to use the API and Licensed Content within 10 (ten) days from such modification",
              "License to Zomato Marks: Subject to the terms of this License Agreement, Zomato hereby grants you a non-transferable, non-exclusive, revocable, non-sublicensable, royalty-free license to use, reproduce and display Zomato’s name, trademarks, service marks and logos identified as set out in the License Content Usage Guidelines (collectively, “Marks”), solely for purposes of performing your obligations or exercising your rights under this License Agreement and strictly in accordance with the License Content Usage Guidelines.",
              "Attribution: All content pages which contain Licensed Content will have a ‘Powered By Zomato’ attribution as described in the Trademark Use Guidelines. Each website content page will have a do-follow link to www.zomato.com, which link will open www.zomato.com in a new window. Each mobile app content page will have a link to open the Zomato mobile app or, if the Zomato app is not installed, to the mobile device’s app store (e.g., Google Play or Apple’s App Store)",
            ],
          },
          {
            heading: "Obligations of Developer",
            info: "",
            list: [
              "Developer Platform: You are responsible for all costs and expenses related to the Developer Application, the Developer Platform, and the integration of the API and/ or the Licensed Content (as applicable) therein.",
              "Compliance: You shall comply with this License Agreement, the Zomato Terms of Use, the Trademark Usage Guidelines, the Zomato Privacy Policy and any other Zomato policy to your use of the API, Licensed Content, Marks and documentation, as the same may be amended by Zomato from time to time.",
              "Credentials: You will be provided with the API credentials , which will be in the form of a secure electronic key provided by Zomato. You shall not share API key with any third party and shall keep the API key safe and secure. You shall only use the API key for the Developer Applications. Zomato reserves the right to (a) issue new API keys to you from time to time; and (b) suspend your API key at its sole discretion. In the event you are unable to access the API with your existing API key, please contact Zomato at api@zomato.com.",
              "Reporting: You will immediately report any security flaws in the API or the Licensed Content or infringement of Marks, and any actual or suspected unauthorized access to the API.",
              "No Modification of Licensed Content: You shall not modify or edit Licensed Content except for formatting changes solely for the purpose of integrating the Licensed Content into the Developer Application, provided that such modification shall not adversely affect the attribution required by Section 3.4.",
              "Privacy: You shall not violate the privacy rights of any individual or entity.",
              "No Interference or Reverse Engineering: You won’t attempt to (i) copy, rent, lease, sell, transfer, assign, sublicense, interfere with, modify or disable any features, functionality or security controls of the API and Licensed Content, (ii) defeat, avoid, bypass, remove, deactivate or otherwise circumvent any protection mechanisms for the Licensed Content or Marks, or (iii) reverse engineer, decompile, disassemble or derive source code, underlying ideas, algorithms, structure or organizational form from the API.",
              "Data received from Zomato:",
              "i. Under this License Agreement, you will receive the Licensed Content through the API key provided by Zomato.",
              "ii. You cannot cache or store, record, pre-fetch or otherwise store any portion of the Licensed Content or undertake any bulk download operations.",
              "iii. You will not directly or indirectly transfer any data received from Zomato to any third party and shall limit access to your employees and contractors with a need to know such information in performance of their duties;",
              "iv. You shall not create or disclose metrics about, or perform any statistical analysis of, the Licensed Content. You shall not disclose any such metrics or analyses related to or connected with the Licensed Content to any third party, during the validity of this Licensed Agreement and for a further period of 3 years following termination of this API Agreement.",
              "v. You shall not use the Licensed Content on your Developer Platform and/or Developer Application to (i) create/ generate additional data or (ii) provide any functionality whereby you or any third party is able to generate additional data using the Licensed Content.",
              "vi.You shall not, directly or indirectly, sell, misuse or abuse the Licensed Content received by you through the API key.",
              "vii.You shall not, directly or indirectly, create enhancements, derivatives, teaser content in all media, mediums, and formats (including, without limitation, all languages), to the Licensed Content.",
              "viii. You shall not comingle the Licensed Content with third party content. Further, you shall not display Licensed Content and Marks along with content that under law are considered to be unlawful, blasphemous, derogatory, objectionable, against public policy and derogatory or detrimental to Zomato’s reputation.",
              "ix. In the event that you stop using the Licensed Content or if this License Agreement is terminated, you must delete all Licensed Content you have received from Zomato or through use of the API and Zomato reserves the right to deactivate the API key provided to you.",
              "x. Zomato may require you to inter alia promptly delete and remove all calls to the API made by you including but not limited to any data received from the API and cease all use of the Marks if you violate the terms and conditions of this License Agreement or any other conditions that Zomato may in the future make applicable to you with regard to the API, the Licensed Content or the Marks.",
            ],
          },
          {
            heading: "Recognition of Absolute Ownership",
            info: 'Zomato shall own and retain all right, title and interest to all the Licensed Content and enhancement thereof, the Marks, the API, and all content displayed on Zomato’s website (except the Developer Application and the Developer Platform) and you hereby recognize and acknowledge such ownership by Zomato. Zomato shall also own all right, title and interest in and to all reviews, photographs, and other user-generated content posted by Users with respect to establishments included in the Licensed Content, all derivative works based upon any of Zomato’s intellectual property and Licensed Content, including any and all intellectual property rights in such user-generated content and in such derivative works; provided, however, that you shall own your confidential information on your website pages, metrics, and internal reporting (including metrics generated on the Developer Platform, even if it is generated on the basis of data that is provided to you by Zomato). To the extent applicable, Zomato shall be deemed to be the "author" of all such derivative works and all such derivative works will constitute "works made for hire" under the U.S. Copyright Act (17 U.S.C. §§ 101 et seq.), Section 17 (c) of Indian Copyright Act, 1957 and any other applicable copyright law. You hereby waive any and all moral rights (including rights of integrity and attribution) in and to such derivative works. To the extent that any of such derivative works does not constitute a work made for hire, you hereby assign to Zomato all right, title and interest that you may have or may hereafter acquire in all such derivative works, including all intellectual property rights therein. At Zomato’s expense, you shall execute all documents and take all actions necessary for Zomato to document, obtain, maintain or assign its rights to such derivative works. All such materials will be deemed to be the confidential, proprietary and trade secret information of Zomato.',
          },
          {
            heading:
              "Developer Obligations and Protection of Information and Access Key",
            info: "In the event of any breach of this License Agreement (including without limitation the confidentiality provisions herein) or unauthorized use of the API and/ or Licensed Content is committed by you and your authorized personnel or others with access to the API key or Licensed Content through you, you shall be liable for such breach or disclosure.",
          },
          {
            heading: "Confidentiality",
            info: "“Confidential Information” means any confidential and/or proprietary information of Zomato or any of its affiliates disclosed to you, and/or obtained by you through Zomato under this License Agreement, either directly or indirectly, in writing or orally and whether or not in tangible or fungible form. Notwithstanding the foregoing, it is clarified that Confidential Information does not include any information which you can demonstrate by reasonable evidence:",
            list: [
              "i. is generally known to, and available for use by, the public other than as a result of the breach of this License Agreement or a breach of another obligation to Zomato of which you are aware;",
              "ii. was known to you at the time of receipt of such information from Zomato without obligation of confidentiality to Zomato or any third party; or",
              "iii. is disclosed to you on a non-confidential basis by a third party; provided, that such third party is not, to your knowledge after due inquiry, bound by an obligation of confidentiality to Zomato or any of its affiliates with respect to such confidential information.",
              "You shall restrict all access to Confidential Information to your authorised personnel on strict a “need to know” basis and apprise them of the confidentiality requirements. This obligation shall survive the termination of this License Agreement for a period of 5 (five) years. Nothing in this Clause 6 (Confidentiality) will prevent you from disclosing Confidential Information where it is required to be disclosed by judicial, administrative, governmental or regulatory process in connection with any action, suit, proceeding or claim or otherwise by applicable law (provided, however, that you use reasonable efforts to provide notice of such disclosure to Zomato and the opportunity for Zomato to seek a protective order to guard the confidentiality of the disclosed confidential information).",
              "During the validity of this License Agreement and for a period of 2 (two) years following expiration or termination hereof, you will not directly or indirectly make or publish any statement or do anything which might reasonably be expected to damage the reputation or any other business interests of Zomato.",
            ],
          },
          {
            heading: "Zomato Use of Developers Trademarks",
            info: "You hereby grant to Zomato a nonexclusive, royalty-free, license during the validity of this License Agreement, to use your name and trademarks solely to promote and advertise the relationship between Zomato and you pursuant to this License Agreement. You understand and agree that Zomato has no obligation (i) to use your name or trademarks or (ii) to promote you or its services.",
          },
          {
            heading: "Independent Parties",
            info: "This License Agreement is on a “principal to principal” basis and the Parties are independent of each other and nothing contained herein is intended to or shall be deemed to create any partnership, joint venture, employment or relationship of principal and agent between the Parties hereto or between Zomato and you and if applicable your representatives and employees or between you and the representatives and employees of Zomato or to provide either of the Parties with any right, power or authority, whether express or implied to create any such duty or obligation on behalf of the other party.",
          },
          {
            heading: "Indemnity",
            info: "You will indemnify and hold harmless Zomato, its affiliates and network partners, and any of their respective officers, directors, employees and agents from and against any claims, costs, charges, damages, losses and expenses (including reasonable attorneys and consultants fees and expenses) with respect to any third party claim relating to or arising out of: (a) your use of any Licensed Content in a manner inconsistent with the terms of this License Agreement; (b) your breach of this License Agreement, (c) breach of any applicable laws, regulations, or ordinances; (d) the Developer Platform or (e) the Developer Applications. Zomato will: (i) promptly notify you of such claim (provided, however, that a failure to provide such notice shall not limit your indemnification obligation hereunder except to the extent that you are materially prejudiced thereby) and (ii) permit you to participate in the defense of any such claim at its expense, with counsel reasonably acceptable to Zomato.",
            list: [
              "Limitation of Liability: IN ADDITION TO YOUR LIABILITY FOR BREACH OF THE TERMS OF THIS AGREEMENT YOU SHALL BE LIABLE FOR BREACHES OF CONFIDENTIALITY, YOUR USE OF THE LICENSED CONTENT,IN A MANNER INCONSISTENT WITH THE TERMS OF THIS LICENSE AGREEMENT. NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOST DATA, LOST PROFITS, LOST REVENUE OR COSTS OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES, HOWEVER CAUSED AND UNDER ANY THEORY OF LIABILITY, INCLUDING BUT NOT LIMITED TO CONTRACT OR TORT (INCLUDING PRODUCT LIABILITY, STRICT LIABILITY AND NEGLIGENCE), AND WHETHER OR NOT SUCH PARTY WAS OR SHOULD HAVE BEEN AWARE OR ADVISED OF THE POSSIBILITY OF SUCH DAMAGE AND NOTWITHSTANDING THE FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY STATED HEREIN. NOTWITHSTANDING ANYTHING TO THE CONTRARY HEREIN CONTAINED ZOMATO’S LIABILITY UNDER THIS LICENSED AGREEMENT SHALL NOT EXCEED $500. FURTHER, IN NO EVENT SHALL YOUR LIABILITY BE LIMITED UNDER THIS LICENSED AGREEMENT. The Parties agree that the mutual agreements made in this Section reflect a reasonable allocation of risk. Any claim arising out of or relating to this License Agreement must be brought by the later of 2 (two) years following the occurrence of the event giving rise to such claim or 1 (one) year following discovery of such claim.",
            ],
          },
          {
            heading: "Termination",
            info: "Zomato reserves the right, in its sole discretion (for any reason or for no reason) and at any time without notice or liability, to change, suspend or discontinue the API, Licensed Content and/or suspend or terminate your rights under this Licensed Agreement to access, use and/or display (as applicable) the API, and/or any Licensed Content",
            list: [
              "Any termination of this License Agreement shall also terminate the licenses granted hereunder. Upon termination of this License Agreement for any reason, you will promptly stop all calls to the API and stop using, and either return to Zomato or destroy and remove, all copies of the Licensed Content, Marks, API Key and any Confidential Information in your possession. Upon such termination or early expiration, Zomato reserves the right to suspend the API key without notice to you.",
              "Notwithstanding the above, the provisions of this License Agreement regarding confidentiality and indemnification and all obligations of Parties arising prior to the expiration or termination of this License Agreement shall survive the expiration or termination of this License Agreement.",
            ],
          },
          {
            heading: "Governing Law and Jurisdiction",
            info: "The validity, construction and performance of this License Agreement shall be governed by, and construed and enforced in accordance with, the laws of India. Any dispute or difference whatsoever arising between the parties out of or relating to the construction, meaning, scope, operation or effect of this agreement or the validity or the breach thereof shall be settled by arbitration in accordance with the Rules of International Commercial Arbitration of the Indian Council of Arbitration and the award made in pursuance thereof shall be binding on the parties. The Parties specifically exclude from application to the Agreement the United Nations Convention on Contracts for the International Sale of Goods and the Uniform Computer Information Transactions Act.",
          },
          {
            heading: "WARRANTY DISCLAIMER",
            info: "ZOMATO MAKES NO REPRESENTATION OR WARRANTY WITH RESPECT TO THE ZOMATO SITE, THE API, THE LICENSED CONTENT AND ZOMATO EXPRESSLY DISCLAIMS ANY AND ALL WARRANTIES, WHETHER EXPRESS, IMPLIED OR STATUTORY, WITH RESPECT TO ZOMATO, THE ZOMATO SITE, THE API, THE LICENSED CONTENT, AND THE MARKS, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTY OF MERCHANTABILITY, INFRINGEMENT OR FITNESS FOR A PARTICULAR PURPOSE, OR ANY IMPLIED WARRANTY ARISING FROM COURSE OF PERFORMANCE, COURSE OF DEALING OR USAGE OF TRADE. ZOMATO DOES NOT WARRANT THAT USE OF THE API WILL BE UNINTERRUPTED OR ERROR-FREE.",
          },
          {
            heading: "Force Majeure",
            info: "Any delay in or failure of performance by Zomato under this License Agreement will not be considered a breach of this License Agreement and will be excused to the extent caused by any occurrence beyond its reasonable control, including, but not limited to, acts of God, power outages, failures of the Internet, failures of banking or any other unforeseeable event.",
          },
          {
            heading: "Legal Compliance",
            info: "You and Zomato will each comply with all laws, rules and regulations, if any, applicable in connection the performance of their respective obligations under this License Agreement.",
          },
          {
            heading: "Miscellaneous",
            info: "",
            list: [
              "If any covenant or provision is adjudged by a court of competent jurisdiction to be unenforceable, invalid or otherwise contrary to law, such covenant or provision will be interpreted so as to best accomplish its intended objectives and shall be enforced as so modified, and the remaining covenants and provisions will remain in full force and effect. The invalidity or unenforceability of any such covenant or provision in one jurisdiction shall not invalidate or render unenforceable such covenant or provision in any other jurisdiction",
              "This License Agreement may be amended by Zomato, at its sole discretion from time to time and shall be applicable to your usage of the Licensed Content under this Agreement.",
              "The Parties agree that any material breach of the provisions of Sections 3, 4.3, 4.7, 4.8, 5, 6, 7, 10 and 12 of this License Agreement shall cause irreparable harm to Zomato, for which monetary damages would not be an adequate remedy, and shall be the basis for specific performance or injunctive relief (without any requirement to post bond).",
              "This License Agreement supersedes any other prior or collateral agreements, whether oral or written, with respect to the subject matter hereof.",
              "The failure to require performance of any provision will not affect a party’s right to require performance at any time thereafter; nor will waiver of a breach of any provision constitute a waiver of the provision itself or of any subsequent breach of such provision.",
              "Nothing in this License Agreement, whether express or implied, is intended to confer any rights or remedies under or by reason of this License Agreement on any persons other than the parties to it and their respective successors and permitted assigns, nor is anything in this License Agreement intended to relieve or discharge the obligation or liability of any third persons to any party to this License Agreement, nor shall any provisions give any third persons any right of subrogation or action over and against any party to this License Agreement.",
              "The parties agree that Zomato may assign any of its rights or transfer by novation any of its rights and obligations under this License Agreement to any of its affiliates or to any acquirer of substantially all of its business without notice to You or Your consent. You may not assign your rights and obligations under this License Agreement without the prior written consent of Zomato, which consent shall be at the discretion of Zomato and may also be subject to conditions as deemed appropriate by Zomato.",
              "A party will not be bound to comply with any provisions of this License Agreement if such compliance would be in contravention or contradictory to applicable law. In such a circumstance such party will inform the other immediately and take necessary steps to comply with applicable law.",
              "All restrictive covenants contained in this License Agreement shall survive the termination of this License Agreement.",
              "Should you have any question with regard to this License Agreement or would like to report any violations of this License Agreement, please contact legal@zomato.com.",
            ],
          },
        ],
      },
    },
    {
      index: "CSR",
      content: "",
      subsections: {
        heading: "I. Zomato’s philosophy and Vision",
        subheading: [
          {
            heading: "",
            info: "Zomato Limited (Formerly known as Zomato Private Limited and Zomato Media Private Limited) (“Company”) is a responsible corporate, which strives for the overall betterment of the society at large. To this end, the Company seeks to undertake Corporate Social Responsibility (“CSR”) activities, which extend beyond the ambit of the business and focuses on human, environmental and social assets, with a special focus on addressing hunger, malnutrition, education and health.",
          },
          {
            heading: "II. Objectives and Scope of the CSR Policy",
            info: "The CSR Policy lays down guidelines for the Company to undertake CSR activities, which are directed towards positively contributing to society through various sustainable and social welfare initiatives. The CSR Policy of the Company shall be governed by the various provisions of the Companies Act, 2013 (the “Act”), Companies (CSR Policy) Rules, 2014 (“CSR Rules”) and any other rules made thereunder, or that may apply from time to time.",
            list: [
              "The Company proposes to undertake the CSR activities in the following areas",
              "Eradicating hunger, poverty and malnutrition, promoting health care including preventive health care and sanitation including contribution to the Swach Bharat Kosh set-up by the Central Government for the promotion of sanitation and making available safe drinking water;",
              "Promoting education, including special education and employment enhancing vocation skills especially among children, women, elderly and the differently abled and livelihood enhancement projects;",
              "Promoting gender equality, empowering women, operate or manage day care centres and such other facilities for senior citizens and measures for reducing inequalities faced by socially and economically backward groups;",
              "Ensuring environmental sustainability, ecological balance, protection of flora and fauna, animal welfare, agroforestry, conservation of natural resources;",
              "Contribution to the Prime Minister's National Relief Fund (PMNRF) or any other fund set up by the Central Government for socio economic development and relief and welfare of the schedule caste, tribes, other backward classes, minorities and women;",
              "Any other activity as specified under the Act, as amended from time to time.",
            ],
          },
          {
            heading: "III. Implementation of the CSR Activities",
            info: "Pursuant to Section 135 of the Act, the Board of Directors of the Company (“Board”) has constituted a CSR committee, vide its resolution dated 7 August 2015 (“CSR Committee”), which was modified vide a Board resolution dated 13 April 2018.\n\nThe CSR Committee and the Board are responsible for ensuring that the Company undertakes CSR activities in accordance with applicable law.\n\nThe following framework will be adopted by the Company as and when it becomes legally obligated to undertake CSR activities as per the provisions of the Act:",
          },
          {
            heading: "Responsibilities of the CSR Committee",
            info: "The CSR Committee shall hold one meeting in every financial year, and if it deems necessary, may hold additional meetings (“CSR Meetings”) for the following matters:",
            list: [
              "Monitor the implementation of the CSR activities undertaken by the Company.",
              "Prepare a status update in respect of each CSR activity.",
              "Deliberate upon and identify new CSR activities that the Company may undertake in that financial year.",
              "Include the details of CSR activities undertaken by the Company during the financial year in the Company’s annual report, as required under Section 134 of the Act.",
              "Discuss any matter in relation to the CSR activities of the Company, that the CSR Committee may choose to discuss.",
            ],
          },
          {
            heading: "Monitoring of CSR activities",
            info: "The CSR Committee shall prepare a transparent monitoring mechanism for ensuring the implementation of the CSR activities proposed to be undertaken by the Company. Further, the CSR Committee shall provide the Board with a quarterly status update on the CSR expenditure.",
          },
          {
            heading: "New CSR Activities",
            info: "The CSR Committee is tasked with identifying new social welfare initiatives that the Company can undertake as CSR activities under the CSR Policy. To this end, the CSR Committee shall explore the feasibility of various initiatives, and evaluate these initiatives in view of the objectives and scope of the CSR Policy and update the same in the policy, if required.\n\nUpon identifying a suitable social welfare initiative, the CSR Committee shall formulate a detailed plan, which specifies, inter alia, the end-goal of the initiative; expected expenditure; the time expected to be spent by the employees of the Company, if any; the modus operandi; timelines for various phases of the initiative; tie-ups or arrangements with third party entities, if any; and any other material factor that the CSR Committee may deem fit to be included (“CSR Plan”).\n\nThe CSR Committee shall place the CSR Plan before the Board, for the Board’s approval. The Board reserves the right to make suitable modifications to the CSR Plan. The Company shall execute the CSR Plan in line with the modifications suggested by the Board.",
          },
          {
            heading: "Revisions to the CSR Policy",
            info: "The CSR Committee shall review and recommend revisions to the CSR Policy, at least once a year and additionally whenever it deems fit, and place before the Board the CSR Policy containing such draft revisions for the Board’s approval. Any revisions to the CSR Policy shall be finalized only pursuant to the Board’s approval; notwithstanding the revisions suggested by the CSR Committee, the CSR Policy shall be amended in the form and manner as approved by the Board.",
          },
          {
            heading: "External Assistance",
            info: "The CSR Committee reserves the right to obtain professional advice from external sources (such as expert agencies, NGOs, governmental authorities, etc.) for the purpose of carrying out the CSR activities (“Third Parties”). Where the Company engages Third Parties, the CSR Committee shall constitute a robust monitoring and implementation mechanism, to ensure that the funds and other resources of the Company are being used in an equitable and commercially judicious manner.\n\nIn the event the Third Party so engaged requires access to the Company’s internal records, the same shall be shared on a need-to-know basis and only after the CSR Committee has passed a unanimous resolution, authorizing the same and recording its reasons in writing.",
          },
          {
            heading: "IV. CSR Expenditure",
            info: "The Board shall ensure that the Company spends, in every financial year, a minimum of 2% of the average net profits of the Company made during the three immediately preceding financial years, on the CSR activities of the Company.\n\nAll expenditure towards the CSR activities shall be diligently documented and maintained for at least 5 (five) years. Any surplus generated out of the CSR activities of the Company shall not form part of the business profits of the Company.",
          },
          {
            heading: "V. Publication",
            info: "The CSR Policy shall be displayed on the Company’s website, available here www.zomato.com and link of the same will also be included in the Directors’ Report for every financial year.",
          },
          {
            heading: "Termination",
            info: "Zomato reserves the right, in its sole discretion (for any reason or for no reason) and at any time without notice or liability, to change, suspend or discontinue the API, Licensed Content and/or suspend or terminate your rights under this Licensed Agreement to access, use and/or display (as applicable) the API, and/or any Licensed Content",
            list: [
              "Any termination of this License Agreement shall also terminate the licenses granted hereunder. Upon termination of this License Agreement for any reason, you will promptly stop all calls to the API and stop using, and either return to Zomato or destroy and remove, all copies of the Licensed Content, Marks, API Key and any Confidential Information in your possession. Upon such termination or early expiration, Zomato reserves the right to suspend the API key without notice to you.",
              "Notwithstanding the above, the provisions of this License Agreement regarding confidentiality and indemnification and all obligations of Parties arising prior to the expiration or termination of this License Agreement shall survive the expiration or termination of this License Agreement.",
            ],
          },
          {
            heading: "Governing Law and Jurisdiction",
            info: "The validity, construction and performance of this License Agreement shall be governed by, and construed and enforced in accordance with, the laws of India. Any dispute or difference whatsoever arising between the parties out of or relating to the construction, meaning, scope, operation or effect of this agreement or the validity or the breach thereof shall be settled by arbitration in accordance with the Rules of International Commercial Arbitration of the Indian Council of Arbitration and the award made in pursuance thereof shall be binding on the parties. The Parties specifically exclude from application to the Agreement the United Nations Convention on Contracts for the International Sale of Goods and the Uniform Computer Information Transactions Act.",
          },
          {
            heading: "WARRANTY DISCLAIMER",
            info: "ZOMATO MAKES NO REPRESENTATION OR WARRANTY WITH RESPECT TO THE ZOMATO SITE, THE API, THE LICENSED CONTENT AND ZOMATO EXPRESSLY DISCLAIMS ANY AND ALL WARRANTIES, WHETHER EXPRESS, IMPLIED OR STATUTORY, WITH RESPECT TO ZOMATO, THE ZOMATO SITE, THE API, THE LICENSED CONTENT, AND THE MARKS, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTY OF MERCHANTABILITY, INFRINGEMENT OR FITNESS FOR A PARTICULAR PURPOSE, OR ANY IMPLIED WARRANTY ARISING FROM COURSE OF PERFORMANCE, COURSE OF DEALING OR USAGE OF TRADE. ZOMATO DOES NOT WARRANT THAT USE OF THE API WILL BE UNINTERRUPTED OR ERROR-FREE.",
          },
          {
            heading: "Force Majeure",
            info: "Any delay in or failure of performance by Zomato under this License Agreement will not be considered a breach of this License Agreement and will be excused to the extent caused by any occurrence beyond its reasonable control, including, but not limited to, acts of God, power outages, failures of the Internet, failures of banking or any other unforeseeable event.",
          },
          {
            heading: "Legal Compliance",
            info: "You and Zomato will each comply with all laws, rules and regulations, if any, applicable in connection the performance of their respective obligations under this License Agreement.",
          },
          {
            heading: "Miscellaneous",
            info: "",
            list: [
              "If any covenant or provision is adjudged by a court of competent jurisdiction to be unenforceable, invalid or otherwise contrary to law, such covenant or provision will be interpreted so as to best accomplish its intended objectives and shall be enforced as so modified, and the remaining covenants and provisions will remain in full force and effect. The invalidity or unenforceability of any such covenant or provision in one jurisdiction shall not invalidate or render unenforceable such covenant or provision in any other jurisdiction",
              "This License Agreement may be amended by Zomato, at its sole discretion from time to time and shall be applicable to your usage of the Licensed Content under this Agreement.",
              "The Parties agree that any material breach of the provisions of Sections 3, 4.3, 4.7, 4.8, 5, 6, 7, 10 and 12 of this License Agreement shall cause irreparable harm to Zomato, for which monetary damages would not be an adequate remedy, and shall be the basis for specific performance or injunctive relief (without any requirement to post bond).",
              "This License Agreement supersedes any other prior or collateral agreements, whether oral or written, with respect to the subject matter hereof.",
              "The failure to require performance of any provision will not affect a party’s right to require performance at any time thereafter; nor will waiver of a breach of any provision constitute a waiver of the provision itself or of any subsequent breach of such provision.",
              "Nothing in this License Agreement, whether express or implied, is intended to confer any rights or remedies under or by reason of this License Agreement on any persons other than the parties to it and their respective successors and permitted assigns, nor is anything in this License Agreement intended to relieve or discharge the obligation or liability of any third persons to any party to this License Agreement, nor shall any provisions give any third persons any right of subrogation or action over and against any party to this License Agreement.",
              "The parties agree that Zomato may assign any of its rights or transfer by novation any of its rights and obligations under this License Agreement to any of its affiliates or to any acquirer of substantially all of its business without notice to You or Your consent. You may not assign your rights and obligations under this License Agreement without the prior written consent of Zomato, which consent shall be at the discretion of Zomato and may also be subject to conditions as deemed appropriate by Zomato.",
              "A party will not be bound to comply with any provisions of this License Agreement if such compliance would be in contravention or contradictory to applicable law. In such a circumstance such party will inform the other immediately and take necessary steps to comply with applicable law.",
              "All restrictive covenants contained in this License Agreement shall survive the termination of this License Agreement.",
              "Should you have any question with regard to this License Agreement or would like to report any violations of this License Agreement, please contact legal@zomato.com.",
            ],
          },
        ],
      },
    },
    {
      index: "Security",
      content: "",
      subsections: {
        heading: "I. Zomato’s philosophy and Vision",
        subheading: [
          {
            heading:
              "Help keep Zomato safe for the community by disclosing security issues to us",
            info: "We take security seriously at Zomato. If you are a security researcher or expert, and believe you’ve identified security-related issues with Zomato’s website or apps, we would appreciate you disclosing it to us responsibly.\n\n\n Our team is committed to addressing all security issues in a responsible and timely manner, and ask the security community to give us the opportunity to do so before disclosing them publicly. Please submit a bug to us on our HackerOne page, along with a detailed description of the issue and steps to reproduce it, if any. We trust the security community to make every effort to protect our users data and privacy.\n\n For a list of researchers who have helped us address security issues, please visit our HackerOne page.\n\nSubmit the bugs to us on our HackerOne page, along with a detailed description of the issue and steps to reproduce it.",
          },
        ],
      },
    },
    {
      index: "Gift Card",
      content: "",
      subsections: {
        heading: "terms and conditions",
        subheading: [
          {
            heading: "",
            info: "",
            list: [
              "The Gift Card is redeemable only on Zomato and Razorpay approved platforms i.e., Zomato website, app or offline stores or website, app or offline stores of Zomato affiliates (“Platform”). The Gift Card can be purchased on the Platform using the following payment modes only: upi, credit card, debit card, and internet banking.",
              "The Gift Card issued by Razorpay shall be governed by the applicable terms here.",
              "The purchaser of Gift Card may add the Gift Card to Zomato Money balance via “Claim” option.",
              "The Gift Card shall be valid for a period of four (4) years from the date of purchase and cannot be used to purchase other gift cards.",
              "Multiple Gift Cards can be clubbed in a single order of purchase.",
              "The Gift Card cannot be redeemed for cash or credit and cannot be reloaded.",
              "In cases where the order is canceled, the Gift Card amount shall be refunded to the source account.",
              "All taxes, duties, levies or other statutory dues and charges payable in connection with the benefits accruing under the offer shall be borne solely by the purchaser of the Gift Card.",
              "The purchaser of the Gift Card is solely responsible for the safety and security of the Gift Card. Zomato and Razorpay are not responsible for any acts of omission or commission if the Gift Card is lost, stolen, or used without permission. Once the Gift Card is claimed, no refund can be issued against such Gift Card.",
              "Razorpay assumes no responsibility for the products purchased using the Gift Card and any liability thereof is expressly disclaimed.",
              "Razorpay reserves the right to cancel the Gift Card if the same has been found to be purchased with fraudulent means and / or the beneficiary / know-your-customer (“KYC”) details are found to be incorrect or insufficient as per RBI guidelines. In such cases, the funds shall be credited back to the same source account from where these were received.",
              "The purchaser of the Gift Card agrees and understands that the Gift Cards are a pre-paid payment instrument subject to regulation by RBI under PPI Master Directions. Under the RBI guidelines, Zomato and / or Razorpay may be required to share KYC details of the purchaser of the Gift Card and /or any other information in relation to purchase of the Gift Card and / or transaction undertaken using the Gift Card with RBI or such statutory authorities. Zomato and / or Razorpay may contact the purchaser of the Gift Card for any such information.",
              "Zomato will honour and consider requests for blocking of the Gift Cards only from the registered users of Zomato.",
              "For any customer grievance, kindly refer to our policy.",
              "The purchaser of the Gift Card may request for the revalidation of the expired Gift Card. Upon receipt of such a request the Gift Card may be revalidated after due verification by Zomato and Razorpay as per PPI master direction.",
              "In the event of any conflict in the terms regarding Gift Card captured here under these Terms and any other terms made available to the purchaser of the Gift Card via Platform, these Terms shall prevail.",
              "Razorpay reserves the right to change the Terms of the Gift Card, including extending, withdrawing or discontinuing at its sole discretion without notice.",
              "These Terms are governed by the laws in India, all disputes arising out of or in connection to this scheme are subject to exclusive jurisdiction of the courts in Bengaluru only.",
            ],
          },
          {
            heading: "",
            info: "These terms and conditions apply to Zomato Gift PPIs (Gift PPIs) which are issued by Pinelabs Private Limited (Pinelabs) for your (User) use. Pinelabs is a private limited company incorporated under the laws of India authorized to issue such Gift PPIs in compliance with applicable Reserve Bank of India (RBI) regulations. The Gift PPIs are issued under the Brand Name of Qwikcilver. Zomato Limited (Zomato) is the co-branding partner for the Gift PPIs.",
            list: [
              "By purchasing, using or redeeming a Gift PPI, the User is agreeing to accept and be bound by these terms and conditions, as updated or modified from time to time.",
              "This Gift PPIs bear a 16-digit electronic PPI number along with a 6-digit pin.",
              "Gift PPIs can be redeemed toward the purchase of eligible products ONLY on www.zomato.com and mobile application under the brand name of Zomato (Zomato Platform).",
              "Once the Gift PPI is purchased, the User cannot cancel it, return it, seek a refund for it or redeem the Gift PPI for cash or credit, except where required by law.",
              "As a pre-requisite to redeeming the  Gift PPI, the User will be required to add the value stored on this Gift PPI into their valid account on the Zomato Platform (Zomato Account). The loading of the Gift PPI onto the Zomato Platform shall constitute a registration of the User with Pinelabs.",
              "The balance in the Zomato Account shall be deducted when the User makes purchases on the Zomato Platform.",
              "The Gift PPI can be combined with promotional codes and with other digital payment options.",
              "Gift PPI cannot be used to purchase other Gift PPIs.",
              "Gift PPI cannot be reloaded or redeemed for cash.",
              "Unused Gift PPI balances associated with a Zomato Account cannot be transferred to another Zomato Account.",
              "Gift PPIs may only be purchased in denominations ranging from INR 100 to INR 10,000, or such other limits as Pinelabs/Zomato may determine.",
              "In case of multiple Gift PPIs being loaded to a User’s Zomato Account, the Gift PPIs having the earliest expiration date will be applied to the User’s purchases on the Zomato Platform.",
              "There is no fee or other charges associated with Gift PPI purchase.",
              "No interest will be payable by Pinelabs on any Gift PPI or Gift PPIs balance.",
              "This Gift PPI is valid for a period of 4 (four) years from the date of activation of the Gift PPI.",
              "Gift PPIs are normally delivered instantly. However, there may be delays in the system upto 72 hours.",
              "Credit and debit cards issued outside India cannot be used to purchase Gift PPIs.",
              "Gift PPIs usage information shall be available on Zomato Platform to the User.",
              "While redeeming the Gift PPIs, if the User’s purchase on the Zomato Platform exceeds the balance in the User Zomato Account, the remaining amount must be paid by the User through credit card, net banking, debit card or other digital payment methods available on the Zomato Platform.",
              "User agrees and understands that the Gift PPI is a prepaid payment instrument regulated by RBI. Under the applicable laws, Zomato / Pinelabs may be required to share the details of the Gift PPI purchaser/ redeemer and/or any other information in relation to the redemption of the Gift PPIs and/or transaction undertaken using the Gift PPIs, with RBI or other governmental/ statutory authorities. Zomato/ Pinelabs may contact the purchaser/ redeemer (as the case may be) of the Gift PPIs for any such information. By registering the Zomato Gift PPIs, User explicitly give their permission for the usage of their personal information to comply with RBI guidelines and regulations.",
              "User agrees to provide truthful and accurate information during the purchase of Gift PPIs. Zomato may contact the User for further information and documents from User to comply with KYC and anti money laundering guidelines issued by RBI from time to time.",
              "Zomato reserves the right to change the Gift PPIs terms and conditions from time to time at its discretion and without prior notice to the User.",
              "If the Gift PPI is non functional, User’s sole remedy (and Pinelabs/ Zomato’s sole potential liability) shall be the replacement of such Gift PPI, for the value remaining in the non-functional Gift PPI.",
              "Zomato shall consider requests for blocking of Gift PPIs only from Users who have registered in accordance with the terms above.",
              "Any cancellations shall be at the sole discretion of Zomato.",
              "Zomato reserves the right to deny accepting any Gift PPI if it suspects that there is duplicity of Gift PPI.",
              "Zomato reserves the right to void the Gift PPI, close customer accounts and take payment from alternative forms of payment if (a) a fraudulently or unlawfully obtained Gift PPI is redeemed and/or used to make purchases on the Zomato Platform, and/or (b) the beneficiary/KYC details as per RBI guidelines are found to be incorrect/insufficient. In such cases, the funds shall be credited back to the same source from where these were received from.",
              "Fraudulent/unlawful/misuse of Gift PPI shall result in cancellation of order, which has been made using the Gift PPI without any liability of Zomato.",
              "Cancellation - In case of any cancellation of orders purchased using Gift PPIs, the amount will be added to the User’s Gift PPIs balance.",
              "The User is solely responsible for the safety and security of the Gift PPI. Further, once the Gift PPI has been sent to the User, the User is bound to protect the Gift PPIs 16 digit code and 6 digit PIN as the same constitutes confidential information. Zomato/Pinelabs shall not be responsible to provide new Gift PPIs in the event (a) this confidentiality obligation is breached by the User, or (b) Gift PPI is lost, stolen or used without permission or unlawfully.",
              "User agrees to indemnify Zomato/ its affiliates, officers, directors, from all claims brought by any third party against Zomato/ its affiliates, officers, directors, arising out of or in connection with any breach of these Gift PPIs terms and conditions.",
              "Zomato does not warrant that the services and products provided to the User pursuant to these terms and conditions will be free of interruptions, errors, bugs, viruses, or security problems.",
              "Neither Pinelabs nor Zomato makes any warranties, express or implied, with respect to Gift PPIs including without limitation, any express or implied warranty of merchantability or fitness for a particular purpose.",
              "Zomato makes no representation or warranty that Zomato Platform will always be accessible without interruption.",
              "In no event shall the liability of Zomato for any claims arising by the purchase or usage of Gift PPIs exceed the value of the respective Gift PPI.",
            ],
          },
        ],
      },
    },
    {
      index: "India",
      content: "",
      subsections: {
        heading: "",
        subheading: [
          {
            heading: "Vibe Content Creation Services Terms and Conditions",
            info: "These Terms forms an integral part of the Sponsored Listing Service Request Form for Vibe Content Services (“Form”) and constitute a legally binding agreement made between you, whether personally or on behalf of an entity (the “Restaurant Partner”/“you”), and Zomato Limited (formerly known as Zomato Private Limited) (“Zomato”).",

            list: [
              "You hereby acknowledge and agree that Zomato is merely facilitating the content creation services which are provided by third-party service providers to you (“Services”). You further agree that Zomato acts solely as an intermediary between you and the third-party service providers (“Freelancer”) for the provision of the Services.",
              "To avail the Services, you have agreed to provide your details to Zomato in the Form, and you further consent to Zomato sharing your details with the Freelancer.",
              "The Services can be availed on a recurring basis for one restaurant page for dining out and in case of a restaurant partner operating multiple restaurants under the same legal entity, the Services can be availed, at once, for such multiple restaurants, for which you are executing the Form.",
              "In consideration for the Services, you undertake to pay the fee to Zomato, as set out in the Form (“Fee”). For clarity, the fee payable for the Services, is independent of the fee payable by the Restaurant Partner to Zomato under the Dining Terms and Conditions. Zomato may revise the Fee with prior intimation to the Restaurant Partner.",
              "If as per the applicable tax laws, you are liable to deduct taxes at source (“TDS”) on Fees paid to Zomato, then you shall make payment of the Fees net of such TDS and shall provide a proof of such TDS deduction within time stipulated under the applicable law. In case of non-receipt of TDS credit, Zomato has a right to claim such TDS amount as recoverable from you against the invoice issued.",
              "Zomato shall raise tax invoices containing such particulars as may be prescribed under GST laws on Restaurant Partner for the services supplied to Restaurant Partner.",
              "You hereby agree and understand that the Services will only be provided once the entire payment of the Fee is made to Zomato. You will not be charged any additional fee over and above the Fee.",
              "You hereby authorize Zomato to instruct the Freelancer, as per the details provided by you and schedule the time and date for performance of Services. You undertake not to amend the schedule and ensure to be available for the completion of the Services on the day and time so finalised. Zomato will allow rescheduling of the Services only under the premium package, once a month. Thereafter, in the event you want to avail the Services you can reach out to us at diningsupport@zomato.com to avail the Services again in accordance with these Terms.",
              "For the purpose of Services, please note that the Freelancer will not stay at the restaurant location for more than the duration of four (4) hours. Accordingly, it will be your responsibility to make sure that everything required for the shoot is ready on time (i.e before or soon after the arrival of the Freelancer) for the Freelancer to complete the shoot within the said duration. In the event you are not satisfied with the Services, then you will resolve any issues with the Freelancer, directly. You hereby acknowledge and agree that any re-shoot will be the sole discretion of the Freelancer.",
              "You understand and agree that the content including any artwork(s), creative(s), logo(s), picture(s), video(s), music, write-up(s), banner(s), image(s) (“Content”) will be shared with you and Zomato by the Freelancer. You further agree to grant Zomato and its affiliates a non-exclusive, royalty-free, irrevocable and perpetual right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display the Content on the Zomato Application.",
              "You further agree that Zomato will not be a party to any disputes or claims between you and the Freelancer for any reason arising from the Services.",
              "You agree to keep Zomato, and its affiliates indemnified for all third-party claims arising from posting/using the Content. Zomato takes no responsibility and assumes no liability for posting/using the Content for which the usage rights have been granted by you.",
              "Zomato shall not be liable to you for (i) special, incidental, exemplary, consequential or punitive damages, however, styled, including without limitation, lost profits or diminution in value or (ii) any losses due to forces beyond the control of Zomato or the Freelancer, including, without limitation, strikes, work stoppages, acts of war or terrorism, insurrection, revolution, nuclear or natural catastrophes or acts of God and interruptions, loss or malfunctions of utilities, communications or computer (software or hardware) services.",
              "All the rights, duties, liabilities and obligations of the respective parties under the Dining Terms and Conditions shall form an integral part of these Terms.",
              "Except as may be varied/modified by these Terms, the Dining Terms and Conditions shall continue to have full force and effect. These Terms shall be governed by and construed in accordance with the laws of India and the courts of New Delhi shall have exclusive jurisdiction over any matter that arises out of these Terms.",
            ],
          },
        ],
      },
    },
    {
      index: "UAE",
      content: "",
      subsections: {
        heading: "",
        subheading: [
          {
            heading: "Vibe Content Creation Services Terms and Conditions",
            info: "These Terms forms an integral part of the Sponsored Listing Service Request Form for Vibe Content Services (“Form”) and constitute a legally binding agreement made between you, whether personally or on behalf of an entity (the “Merchant”/“you”), and Zomato Middle East FZ LLC Dubai Branch (“Zomato”).\n\n You acknowledge that these Terms will form an integral part of the restaurant partner terms and conditions (available at https://www.zomato.com/policies/zomato-dining/uae) or Zomato Dining (“Dining Terms and Conditions”). In the event of a conflict between these Terms and the Dining Terms and Conditions, these Terms will prevail to the extent provided herein. By availing the Services (as defined below), you agree to be bound by the Terms set out below:",
            list: [
              "You hereby acknowledge and agree that Zomato is merely facilitating the content creation services which are provided by third-party service providers to you (“Services”). You further agree that Zomato acts solely as an intermediary between you and the third-party service providers (“Freelancer”) for the provision of the Services.",
              "To avail the Services, you have agreed to provide your details to Zomato in the Form, and you further consent to Zomato sharing your details with the Freelancer.",
              "The Services can be availed on a recurring basis for one restaurant page for dining out and in case of a restaurant partner operating multiple restaurants under the same legal entity, the Services can be availed, at once, for such multiple restaurants, for which you are executing the Form.",
              "In consideration for the Services, you undertake to pay the fee to Zomato, as set out in the Form (“Fee”). For clarity, the fee payable for the Services, is independent of the fee payable by the Merchant to Zomato under the Dining Terms and Conditions. Zomato may revise the Fee with prior intimation to the Merchant.",
              "Zomato shall raise a tax invoice containing such particulars as may be prescribed under VAT laws on Merchant for the services supplied to Merchant.",
              "You hereby agree and understand that the Services will only be provided once the entire payment of the Fee is made to Zomato.",
              "You hereby authorize Zomato to instruct the Freelancer, as per the details provided by you and schedule the time and date for performance of Services. You undertake not to amend the schedule and ensure to be available for the completion of the Services on the day and time so finalised. Thereafter, in the event you want to avail the Services you can reach out to us at _diningsupport@zomato.com_ to avail the Services again in accordance with these Terms.",
              "For the purpose of Services, please note that the Freelancer will not stay at the restaurant location for more than the duration of two (2) hours, unless an alternative duration is agreed with the Freelancer. Accordingly, it will be your responsibility to make sure that everything required for the shoot is ready on time (i.e before or soon after the arrival of the Freelancer) for the Freelancer to complete the shoot within the said duration. In the event you are not satisfied with the Services, then you will resolve any issues with the Freelancer, directly. You hereby acknowledge and agree that any re-shoot will be the sole discretion of the Freelancer.",
              "You understand and agree that the content including any artwork(s), creative(s), logo(s), picture(s), video(s), music, write-up(s), banner(s), image(s) (“Content”) will be shared with you and Zomato by the Freelancer. You further agree to grant Zomato and its affiliates a non-exclusive, royalty-free, irrevocable and perpetual right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display the Content on the Zomato Application.",
              "You further agree that Zomato will not be a party to any disputes or claims between you and the Freelancer for any reason arising from the Services.",
              "You agree to keep Zomato, and its affiliates indemnified for all third-party claims arising from posting/using the Content. Zomato takes no responsibility and assumes no liability for posting/using the Content for which the usage rights have been granted by you.",
              "Zomato shall not be liable to you for (i) special, incidental, exemplary, consequential or punitive damages, however, styled, including without limitation, lost profits or diminution in value or (ii) any losses due to forces beyond the control of Zomato or the Freelancer, including, without limitation, strikes, work stoppages, acts of war or terrorism, insurrection, revolution, nuclear or natural catastrophes or acts of God and interruptions, loss or malfunctions of utilities, communications or computer (software or hardware) services.",
              "All the rights, duties, liabilities and obligations of the respective parties under the Dining Terms and Conditions shall form an integral part of these Terms.",
              "Except as may be varied/modified by these Terms, the Dining Terms and Conditions shall continue to have full force and effect. These Terms shall be governed by and construed in accordance with the laws of UAE and the courts of Dubai shall have exclusive jurisdiction over any matter that arises out of these Terms.",
            ],
          },
        ],
      },
    },
  ];

  const sideTabsOnline = [{ title: "India" }];
  const sideTabsDining = [{ title: "India" }, { title: "UAE" }];
  const contentOnline = [
    {
      index: "India",
      content: "",
      subsections: {
        heading:
          "TERMS AND CONDITIONS OF RESTAURANT PARTNER ENROLMENT FORM FOR FOOD ORDERING AND DELIVERY SERVICES (TERMS)",
        subheading: [
          {
            heading: "",
            info: "These Terms form part of the Restaurant Partner Enrolment Form for Food Ordering and Delivery Services (Form) and constitute a legally binding agreement made between you, whether personally or on behalf of an entity (the Restaurant Partner), and Zomato Limited and its affiliates (collectively, Zomato), regarding use of Zomato's Platform (as defined below) for the provision of Restaurant Services (as defined below) by the Restaurant Partner to the Customers (as defined below).",
          },
          {
            heading: "1. Definitions",
            info: "",
            list: [
              "i. Asset Handover Form means the form shared by Zomato, which includes details of the assets provided by Zomato to the Restaurant Partner and annexed to the Form.",
              "ii. Calendar Month means a month as named in the English calendar.",
              "iii. Service fee (formerly known as Commission) means the amount payable by the Restaurant Partner to Zomato, as set out in the Form.",
              "iv. Customer means users who place Orders through the Platform.",
              "v. Customer Application means the proprietary online website and/or mobile based Order placement application of Zomato available on the Platform, which enables the Customers to (a) place an Order with the Restaurant Partner for the purpose of availing Restaurant Services; and (b) track the status of the Order placed by such Customer with the Restaurant Partner; and (c) facilitates a provision of payment by the Customer towards the Restaurant Services availed from the Restaurant Partner.",
              "vi. Customer Data means any and all identifiable information about Customer provided by the Customer via the Platform, including, but not limited to, Customer’s name, delivery addresses, email addresses, phone numbers, and Customer preferences, to be governed by the Privacy Policy.",
              "vii. Delivery Charges means the delivery fee charged by the Delivery Partner from the Customers on each Order where Zomato facilitates delivery of an Order to the Customers.",
              "viii. Delivery Surge means an amount charged by the Delivery Partner from the Customers over and above the Delivery Charges on some Orders, determined on the basis of various factors including but not limited to order value, distance covered, time taken, demand for delivery, real time analysis of traffic and weather conditions, seasonal peaks or such other parameters as may be determined from time to time.",
              "ix. Electronic Payment Mechanism means the online and mobile based payment mechanisms including the third party payment gateways, credit card/debit card/net banking transfer and/or e-wallets and/ or Zomato credits that are available on the Platform for the purposes of facilitating the payment of the Order Value by the Customer.",
              "x. Execution Date means the date of execution of Form.",
              "xi. Form means the Restaurant Partner Enrolment Form for Food Ordering and Delivery Services executed by the Restaurant Partner.",
              "xii. Gross Sales means the gross amount charged by the Restaurant Partner to any Customer that is attributable to any Order placed through Zomato's Platform including all applicable taxes less discounts being offered by the Restaurant on Zomato’s Platform (if any).",
              "xiii. Information means the information set out and provided along with the Form and includes any information which is supplied by the Restaurant Partner to Zomato under these Terms such as Restaurant Partner’s name, establishment name, logo, the Menu items and images for menu items, the price lists underlying the Menu, opening hours of the restaurants operated by the Restaurant Partner, rates at which taxes are charged by the Restaurant Partner to the Customer, delivery areas serviced by the restaurants and/or delivery terms, specific information the Restaurant Partner is under an obligation to supply to Zomato (a) immediately on the Execution Date; or (b) within 1 (one) day from any change in such information.",
              "xiv. Delivery Partner means a third party service provider who collects Order(s) from the Restaurant and delivers it to the Customer location.",
              "xv. Logistics Services means facilitation services offered by Zomato wherein Zomato would connect the Restaurant Partner with Delivery Partner through its online technology platform, who shall pick Order(s) from the Restaurant, and deliver the same to the Customers.",
              "xvi. Menu means any document or virtual page, which lists out the items for sale offered by the Restaurant Partner to the Customer, on the Platform.",
              "xvii. Menu Item Categorisation means tagging with respect to food items between Restaurant Service and Supply of Foods and Beverages Items (as defined below) as confirmed by the Restaurant Partner to Zomato.",
              "xviii. Merchant Application means the Zomato developed Order management application pre-loaded in the Tablet and/ or Zomato Device which provides Restaurant Partner the ability to (a) receive an Order for the Restaurant Services; (b) allows the Restaurant Partner to accept or reject the Order within stipulated time; (c) provide updates on the Customers Order and its status; and (d) place a request for Logistics Services, if applicable.",
              `"Multiple Outlet Entity" means the Restaurant, which has more than one outlet under the same ownership providing Restaurant Services.`,
              `"Net Order Value" means Order Value received, less the Service fee and any other additional amount, charges etc. that are due to Zomato from the Restaurant Partner under these Terms or the Form.`,
              `"Net Sales" means the Gross Sales less applicable taxes charged by the Restaurant and delivery charge and any similar charges levied by the Restaurant (if any);`,
              `"One Time Sign–Up Fee" means a one time non-refundable amount set out in the Form, payable by the Restaurant Partner when availing the Services for the first time from Zomato.`,
              `“Optional Services" means the optional services offered to the Restaurant Partner by Zomato from time to time.`,
              `"Order" means the placement of an order by the Customer with the Restaurant Partner for the purchase of any item via the Platform.`,
              `"Order Value" means the amount which is payable by the Customer upon placement of an Order with the Restaurant Partner on the Platform for the Restaurant Service.`,
              `"Parties" means Zomato and the Restaurant Partner.`,
              `"Payment Mechanism Fee" means the amount payable by the Restaurant Partner to Zomato, being a % of Order Value including taxes less any charge not levied by Restaurant but collected by Zomato, as more specifically set out in the Form;`,
              `"Platform" means the Website and Customer Application owned and operated by Zomato.`,
              `"Pre-Packaged Goods" means the food and beverages items packaged in such a manner that the contents cannot be changed without tampering it and which is ready for sale to the Customer and as may be defined under the Food Safety and Standards Act, 2006 from time to time.`,
              `"Restaurant Partner Compensation Policy" means the compensation policy available at https://www.zomato.com/o2termscompensationpolicy/india and applicable to the Restaurant Partner in the event an Order is cancelled or rejected for reasons not attributable to the Restaurant Partner.`,
              `"Restaurant" means a commercial establishment(s) for which the Restaurant Partner is executing the Form, and from where the Restaurant Services are made available to the Customer, moreover wherein the food and beverage items are prepared and/or delivered to the Customer.`,
              `"Restaurant Partner" means the entity/individual being the legal owner of the Restaurant as mentioned in the Form.`,
              `"Restaurant Service" means supply by way of service of food and beverages items attracting tax under Section 9(5) of the Central Goods and Services Tax Act, 2017, listed on the Menu from time to time, sold by the Restaurant, listed and advertised by the Restaurant Partner on the Platform.`,
              `"Service Operator" means the Zomato operated centralized system used for receiving Orders from Customers through the Customer Application and transmitting those to the Restaurant Partner.`,
              `"Services" means the services offered by Zomato to the Restaurant Partner, on and from the Effective Date, including the following: 
        - Order placement and catalog hosting services: Zomato provides the Order placement mechanism for the Customers to place Orders with the Restaurant Partner on a real time basis and helps with listing of the menu and price lists as provided by the Restaurant Partner.
        - Demand generation and marketing: Zomato helps bring new Customers to Restaurant Partner every day. This is done through targeted marketing, enabling appropriate discovery and creating a seamless food ordering experience.
        - Logistics Services: Zomato creates competitive earning opportunities for Delivery Partners, with an intent to create a high quality and reliable delivery ecosystem for delivering Restaurant Partner’s Orders.
        - Support for Customers, Restaurants and Delivery Partners: Customers, Restaurant Partner, and Delivery Partners all have unique needs that often need addressing immediately. Zomato has a team working 24*7/365 ready to help solve any issues, so that the Customers, Restaurants and Delivery Partners experience is seamless.
        - Technology infrastructure: Zomato builds and supports products for Customers, Restaurants and Delivery Partners including payment infrastructure which requires high quality talent and investments.`,
              `“Single Outlet Entity” means the Restaurant, which has only one outlet providing Restaurant Services.`,
              `“Orders requiring support” means order where Zomato support teams extend additional support to mitigate customer escalations including but not limited to, delay in accepting or handing over the Order(s), poor quality food, missing or incorrect item, poor quality packaging, etc.`,
              `"Supply of Food and Beverages Items" means supply of any food and beverages items, made by the Restaurant through the Platform, other than Restaurant Service attracting tax under Section 9(5) of the Central Goods and Services Tax Act, 2017.`,
              `"Tablet" means an electronic Order placement Tablet device preloaded with the Merchant Application.`,
              `"Website" means www.zomato.com (including the webpages contained or hyperlinked therein and owned or controlled by Zomato), and such other media or media channels, devices, mobile applications, software, or technologies as Zomato may choose from time to time.`,
              `"Zomato Device" means a smart phone loaded with the Merchant Application.`,
            ],
          },
          {
            heading: "2. Zomato’s Obligations:",
            info: "",
            list: [
              "Zomato will list Restaurant Partner’s menu and the price list on the Platform and transfer to the Restaurant Partner the amounts received from the Customers in accordance with agreed Terms set out herein.",
              "Zomato will display on the Platform, on a best effort basis, all necessary information provided by the Restaurant Partner. However, Zomato is not under any obligation to display any information until the Restaurant Partner provides all required information.",
              "Zomato will retain the right to change the rate of taxes on the Menu item list shared by the Restaurant Partner for listing on the Platform.",
              "Zomato will transmit the Orders placed by the Customer with the Restaurant Partner based on the agreed mechanisms.",
              "Zomato will redress the Customers and the Restaurant Partner’s complaints in respect of the functioning of the Platform and/or the Tablet or Zomato Device.",
              "For clarity, Zomato is only responsible for providing a Platform and Logistics Services but not the quality or processing of the Orders.",
              "Zomato may suspend the Restaurant Partner’s account if they are non-compliant with food safety standards.",
              "While providing Logistics Services, Zomato is not liable for quality or quantity unless the package is tampered with during delivery.",
              "Zomato facilitates logistics by connecting Delivery Partners with Restaurant Partners and cannot be held liable for any unlawful activity by the Delivery Partner.",
              "Zomato shall provide a web dashboard to the Restaurant Partner if the necessary requirements are met.",
            ],
          },
          {
            heading: "3. Restaurant Partner’s Obligations",
            info: "",
            list: [
              "The Restaurant Partner will not discriminate while servicing Orders received from Customer ordering via the Platform. Restaurant Partner will not provide any preferential treatment to customers ordering independently from the Restaurant Partner.",
              "The Restaurant Partner will respect the dignity and diversity of Delivery Partners and accordingly will not discriminate against any Delivery Partner on the basis of Discrimination Characteristics. The Restaurant Partner is expected to enable a secure and fearless gig work environment for Delivery Partners, including prevention of harassment.",
              "Restaurant Partner shall ensure all mandatory information pertaining to taxes, levies, and charges applicable on the Orders are clearly visible to Customers on their invoice issued for any supply other than Restaurant Service.",
              "Restaurant Partner will ensure that the information provided to Zomato is current and accurate, including but not limited to the Restaurant Partner's name, address, contact details, delivery times, opening hours, menus, price lists, taxes, service addresses, and other relevant information.",
              "Restaurant Partner shall confirm Menu Item Categorisation between Restaurant Service and Supply of Foods and Beverages Items and indemnify Zomato for losses due to mis-declaration.",
              "Restaurant Partner shall ensure ownership or control over all content/material submitted to Zomato and ensure it does not infringe any third-party rights.",
              "Restaurant Partner shall process and execute Orders promptly.",
              "The Restaurant Partner shall turn off the 'Accepting Delivery' feature if unable to provide Restaurant Services.",
              "In case of hampered Customer experience due to Restaurant Partner’s actions, Zomato reserves the right to take appropriate action.",
              "Restaurant Partner shall inform Zomato about any changes made to an Order by the Customer directly.",
              "Restaurant Partner agrees to forgo any Order Value for cancellations accepted by them.",
              "Restaurant Partner shall ensure a signed receipt is collected for online payments if they are handling logistics.",
              "Restaurant Partner shall retain proof of delivery for 180 days from the delivery date.",
              "For deliveries undertaken by the Restaurant Partner, only trained personnel shall ensure food safety and timely delivery.",
              "The food and beverages provided shall be of high quality, fit for human consumption, and compliant with applicable laws.",
              "If availing Optional Services, the Restaurant Partner will adhere to additional terms communicated by Zomato.",
              "Restaurant Partner shall contact Customers if clarification is required for an Order post-confirmation.",
              "Restaurant Partner shall promptly address Customer complaints referred by Zomato.",
              "Restaurant Partner shall remove unavailable menu items from the platform.",
              "Restaurant Partner acknowledges sole responsibility for Order delivery if Logistics Services are not availed.",
              "Zomato is not liable for the quality, processing, or delivery of Orders where Logistics Services are not provided.",
              "Orders must match the Customer's request, and packaging must prevent spillage.",
              "Adequate verification and training of delivery personnel must be ensured by the Restaurant Partner.",
              "Orders handled by the Restaurant Partner should not be commingled with others.",
              "Restaurant Partner shall address Customer complaints related to Restaurant Services within prescribed timelines.",
              "Restaurant Partner shall provide requisite legal documents like PAN Card, TAN, GSTIN, etc., as required.",
              "Orders handed over to Zomato delivery personnel must be in spill-proof packaging.",
              "Single-use plastic is prohibited for packing Orders; non-compliance may lead to Order cancellation or penalties.",
              "Orders must be ready for pickup at the indicated kitchen preparation time.",
              "Restaurant Partner shall not make independent calls to Customers asking for payments beyond agreed amounts.",
              "Customer data shall only be used for fulfilling Orders and not for unsolicited marketing.",
              "Restaurant Partner shall not engage in fraudulent activities or misuse Customer benefits.",
              "Restaurant Partner shall not charge Customers delivery fees for Orders where delivery is not handled by them.",
              "Restaurant Partner is responsible for hybrid model deliveries not availed through Zomato Logistics.",
              "The Merchant Application must be updated as new versions become available.",
              "Restaurant Partner is solely liable for any assets provided to Logistics Personnel that are damaged, stolen, or not returned.",
            ],
          },
          {
            heading: "xl. Zomato Gold",
            info: "",
            list: [
              "The Restaurant agrees to extend the percentage of discount or a flat discount to the Zomato Gold Customer as agreed in writing on the Gross Sales ('Discount') for every Order that is above the Minimum Order Value.",
              "The Restaurant Partner permits Zomato to deduct the amount towards Discount as per the Payment Settlement Process.",
              "The Discount can be combined with other offers or discounts provided by the Restaurant Partner, Zomato, or any third party.",
              "The Discount is valid on all days and operational hours of the Restaurant.",
              "The Discount applies to all food and beverage items except items sold at MRP and spirits.",
              "The Discount is valid only on delivery orders.",
              "The agreement commences from the Commencement Date and remains valid unless terminated by either party.",
              "Either party may terminate the agreement with seven (7) days prior written notice.",
              "Termination of Zomato Gold terms does not affect other food ordering and delivery service terms.",
              "Zomato may modify these terms immediately upon reflecting the changes on the Platform.",
              "Zomato reserves the right to alter or discontinue Zomato Gold, with the Restaurant Partner reserving the right to terminate with fifteen (15) days written notice.",
              "Ensure a functional Tablet/Zomato Device to receive and confirm Customer Orders, provide delivery time estimates, and update Order statuses.",
              "Orders may be declined via the Tablet/Zomato Device but alternate means like phone/emails cannot be used to circumvent the process.",
              "Execute Orders promptly and update the estimated delivery time through the Merchant Application.",
              "Ensure a functional Restaurant Partner Device to receive/reject Orders, provide delivery time estimates, and communicate with Service Operators via phone or SMS.",
              "Orders placed through the Service Operator may be declined, but alternate means like phone/emails cannot be used to circumvent the process.",
            ],
          },
          {
            heading: "xliii. Promotions",
            info: "",
            list: [
              "These Promotion Terms apply to a Restaurant Partner’s engagement in Promotions pursuant to which the Restaurant Partner shall extend discounts or offers to Customers on Orders placed with the Restaurant Partner via the Platform.",
              "These Promotion Terms do not alter in any way, the terms or conditions of any other agreement the Restaurant Partner may have with Zomato.",
              "Unless the context otherwise requires, the capitalized terms used herein and not otherwise defined shall have the meaning assigned to them in the Terms.",
              "By accepting to sign up for Promotions, the Restaurant Partner hereby agrees to the below:",
              "The Restaurant Partner acknowledges and agrees that it shall determine and make available Promotions to Customers at its sole discretion.",
              "Promotions mean the discounts or offers determined and made available for Customers on Orders placed with the Restaurant Partners via the Zomato Platform. The Promotions are only valid on food ordering and delivery.",
              "The Restaurant Partner agrees that the cost of discount under the Promotions shall be completely funded by the Restaurant Partner.",
              "The Restaurant Partner at its sole discretion shall determine the details and validity period of the Promotions.",
              "The Restaurant Partner acknowledges and agrees that the Promotions once determined and made available via the Zomato Platform cannot be modified during the validity period. However, the Restaurant Partner may replace a Promotion with a new (modified) Promotion, after giving due notice to Zomato.",
              "The Promotions during the validity period may be suspended or revoked any time at the Restaurant Partner’s sole discretion.",
              "The Restaurant Partner can have any number of Promotions running at a given time.",
              "Unless otherwise specified, the Promotions can be combined with any other offers extended by the Restaurant Partner or Zomato or any other third party.",
              "The Restaurant Partner agrees to indemnify and hold Zomato and its directors, officers, agents, representatives, and employees harmless from and against any claims, suits, liabilities, judgments, losses, and damages arising out of or in connection with: (a) any claim or suit or demand on account of the Restaurant Partner failing to honor any Promotions; and/or (b) breach of any applicable law.",
              "Zomato has no role or responsibility towards the Promotion(s) and will not be liable to the Restaurant Partner or the Customer for any claim relating to the Promotion(s).",
              "The Promotion(s) are subject to Zomato’s approval. Zomato reserves the right to reject or remove the Promotion(s) at any time, for reasons communicated to the Restaurant Partner.",
              "Zomato will determine, in its sole discretion, the placement, and positioning of the Promotion(s) on the Zomato Platform.",
              "Zomato does not guarantee the reach or performance of the Promotion(s).",
              "The Restaurant Partner is solely liable for compliance with all applicable laws relating to the Promotions.",
              "The arrangement between the parties shall commence from the date of acceptance of these Promotion Terms by the Restaurant Partner and shall be valid and binding unless terminated in accordance with these Promotion Terms.",
              "The Restaurant Partner may at any time opt out of Promotions without any prior notice to Zomato.",
              "Zomato may terminate the arrangement at any time with a one (1) day prior written notice of termination to the Restaurant Partner.",
              "Zomato may suspend and/or terminate the Services if the Restaurant Partner is in breach of these Promotion Terms and such breach has not been rectified within five (5) days of notice of breach.",
              "Zomato reserves the right to modify the Promotion Terms after prior notice and without liability to the Restaurant Partner. Any such changes will be effective immediately upon the changes being reflected on the Terms.",
              "Zomato reserves the right to discontinue the Promotions at its discretion at any time, without any notice or liability to the Restaurant Partner if necessitated due to legal or regulatory requirements. The Restaurant Partner will be provided with adequate reasons for discontinuation in due course.",
              "Termination of these Promotion Terms shall have no effect on the Terms.",
              "All the rights, duties, liabilities, and obligations of the respective parties under the Terms shall form an integral part of these Promotion Terms and shall remain unaltered by these Promotion Terms.",
              "Except as provided herein and varied/modified, the Terms shall continue to have full force and effect.",
              "For any help or queries regarding Promotions, you may reach out via the help center on the Merchant Application.",
            ],
          },
          {
            heading: "4. License",
            info: "Restaurant Partner grants to Zomato an unrestricted, non-exclusive, royalty-free licence in respect of all Content (defined hereinabove) and Information provided to Zomato by the Restaurant Partner for the purposes of inclusion on the Platform and as may be otherwise required under the Form. This includes, but is not limited to, (a) use of the Restaurant Partner’s name in the context of Google adwords to support advertising and promotional campaigns to promote food ordering and delivery on internet which may be undertaken by Zomato (b) preparation of derivative works of, or incorporate into other works, all or any portion of the marketing materials which will be made by Zomato for the purposes of its business.\n\nAny Content, information or material that the Restaurant Partner transmits or submits to Zomato either through the Platform or otherwise shall be considered and may be treated by Zomato as non-confidential, subject to Zomato’s obligations under relevant data protection legislation.\n\nThe Restaurant Partner also grants to Zomato a royalty-free, perpetual, irrevocable, non-exclusive license to use, copy, modify, adapt, translate, publish and distribute world-wide any Content, information or material for the purposes of providing Services under these Terms or to or for the purposes of advertising and promotion of the Platform. The Restaurant Partner agrees that all Content , information or material provided to Zomato that is published on the Platform, may be relied upon and viewed by Customers to enable them to make informed decisions at the prepurchase stage.",
          },
          {
            heading: "5. Restaurant Partner Menu and Price List",
            info: "",
            list: [
              "Zomato will display on the Platform the menu and price list for all of its Restaurant Partners. Zomato reserves the right to modify or delete certain items from the Restaurant Partner’s menu list to ensure compliance with applicable laws. Updates to the price list will be made within 48 hours of receiving written notification from the Restaurant Partner. If the Restaurant Partner has access to an admin panel or dashboard (subject to Zomato’s written consent), they must ensure that the information is kept true, accurate, and updated, comply with Zomato’s internal terms, and inform Zomato of changes.",

              "Restaurant Partner shall provide Zomato with a separate list of all Pre-Packaged Goods to be listed on the Platform, in a format acceptable to Zomato.",

              "Pre-Packaged Goods listed on the Platform must have a shelf life of at least 30 percent or 45 days before expiry at the time of delivery to the Customers.",

              "The Restaurant Partner will maintain equal or lower prices for all products offered via the Platform compared to prices offered through direct channels, including dine-in, takeaway, or delivery from its own locations or other channels such as websites/apps. Pricing includes food, beverage, and packaging charges.",

              "If special portion sizes are created for the Platform compared to portion sizes on its own channels, pricing should be proportionate or lower for the menu on the Platform.",

              "If the Restaurant Partner fails to maintain prices as per clauses iv. and v., Zomato reserves the right to take appropriate action as per its policies.",

              "The Restaurant Partner shall not charge an amount exceeding the maximum retail price (MRP) for food and beverage items with an MRP mentioned on them.",

              "Zomato will use its best endeavours to ensure the Platform is not misused for placing erroneous or fraudulent Orders. The Restaurant Partner must report such Orders using the Tablet, Zomato Device, or call Zomato for investigation. Zomato provides built-in features in the Merchant Application and web dashboard for this purpose.",

              "Zomato may perform various marketing activities to promote the Restaurant Partner and its menu. Such activities will be determined at Zomato’s sole discretion, and the Platform may be modified or updated without notice to reflect these changes.",
            ],
          },
          {
            heading: "6. Use of Zomato Tablet or Zomato Device",
            info: "",
            list: [
              "In the event Zomato provides the Restaurant Partner with the Tablet or Zomato Device, the device shall be used solely for: (a) confirming, cancelling, and accessing Orders; (b) reviewing Order particulars; (c) updating Order status; (d) communicating with Zomato; (e) reporting erroneous Orders; (f) availing Logistics Services; and/or (g) any other written uses prescribed by Zomato.",

              "The Restaurant Partner undertakes to use the Tablet or Zomato Device in compliance with Zomato’s instructions. The Restaurant Partner shall not remove the preloaded SIM Card or make/receive calls or texts using it. The SIM Card is issued to Zomato by a telecom provider and licensed to the Restaurant Partner exclusively for confirming or declining Orders during the specified duration.",

              "Unauthorized use or misuse of the SIM Card by the Restaurant Partner shall be considered a material breach of Terms and may lead to liability under applicable laws.",

              "Upon delivery of the Tablet or Zomato Device by Zomato, the Restaurant Partner must acknowledge receipt in writing by executing an Asset Handover Form as annexed to the Form.",

              "The Terms grant a limited, non-exclusive, non-transferable, royalty-free license from Zomato to the Restaurant Partner to use the Tablet or Zomato Device and the embedded Merchant Application, only for purposes prescribed in these Terms. The Restaurant Partner must not violate Zomato’s intellectual property rights.",

              "If the Tablet or Zomato Device or its accessories are damaged by the Restaurant Partner or its representatives, Zomato may replace them at an additional cost to the Restaurant Partner or charge for such loss.",

              "The Restaurant Partner must return the Tablet or Zomato Device with accessories in full working condition immediately upon termination of the Terms or upon Zomato’s request. Zomato’s authorized representatives will collect the device. Failure to return the device will make the Restaurant Partner liable to pay Zomato or face legal action.",

              "Zomato is not the manufacturer of the Tablet or Zomato Device and does not provide warranties or guarantees regarding quality, merchantability, or durability. The Restaurant Partner acknowledges this before using the device.",

              "Zomato is entitled to recover amounts from the Restaurant Partner for lost or damaged devices and accessories as follows:",

              "refurbished Zomato Device",
              "For physical damage, Zomato may recover the full device cost.",
              "For software issues within 3 months of issuance, Zomato will replace; after 3 months, full recovery applies.",

              "new Zomato Device",
              "For physical damage, Zomato may recover the full device cost.",
              "For software issues within 6 months of issuance, Zomato will replace; after 6 months, full recovery applies.",

              "tablet and accessories charges INR 16,000 for lost or damaged Tablet, INR 500 for lost or damaged accessories.",
            ],
          },
          {
            heading: "7. Payments Mechanism",
            info: "",
            list: [
              "The Restaurant Partner acknowledges and agrees that the Platform will provide the following payment mechanisms to the Customers for payment of the Order Value:",
              "Cash on delivery;",
              "Electronic Payment Mechanism;",
              "Redemption of vouchers and/or discount coupons (if any) approved by Zomato.",

              "The Restaurant Partner acknowledges and agrees that Zomato will provide the Restaurant Partner with a monthly invoice within 7 days from the last date of the preceding month for the Service fee, Payment Mechanism Fee, refund charges, One Time Sign Up Fee and other payable amounts related to applicable Orders.",

              "Invoices will be sent to the Restaurant Partner by email. All invoices shall be issued from the respective state registered office of Zomato performing the Services to comply with Goods & Services Tax (GST) laws in India. The list of Zomato’s state registered offices is available at Licenses.",

              "The Restaurant Partner acknowledges and agrees that all amounts payable to Zomato under these Terms are exclusive of applicable taxes, and that all applicable taxes will be charged separately.",
            ],
          },
          {
            heading:
              "8. Obligations of Parties in Case of Online Payment Orders",
            info: "",
            list: [
              "The Restaurant Partner must meet all of the following requirements when it receives an online payment Order:",
              "Ensure that it does not receive any additional payment from a Customer (including but not limited to payment by cash) when payment has been made online by a Customer;",
              "Follow all special instructions contained on the Order receipt or as communicated by Service Operator;",
              "Obtain a signature from the Customer acknowledging receipt of the Order when the Restaurant Partner undertakes delivery of the Orders independently or through third parties, other than Zomato.",

              'If the Restaurant Partner has not complied with the delivery instructions (as set forth in this Order receipt) or has supplied bad quality Goods to the Customer, whereby Zomato has (pursuant to the Customer’s complaint) been constrained to refund the Order Value to the Customer ("Problem Order") in any manner, the Restaurant Partner acknowledges and agrees that:',
              "The Restaurant Partner will not be paid for such Problem Order;",
              "If the Restaurant Partner has already received the Order Value from Zomato in respect of such Problem Order (subject to the appropriate reductions under Clause 10), Zomato will have the right to deduct or offset such amount from any monies owed by Zomato to the Restaurant Partner (in respect of future Orders) under these Terms.",

              "Restaurant Partner shall disclose all relevant details pertaining to Problem Order(s) with Zomato, if required by Zomato.",

              "Zomato will communicate promptly with its bank if it becomes aware of any fraud having been committed by a Customer.",
            ],
          },
          {
            heading: "9. Payment Settlement Process",
            info: "",
            list: [
              "The Restaurant Partner acknowledges and agrees that any Order Value collected by Zomato for, and on behalf of, the Restaurant Partner shall be passed on subject to deduction of:",
              "Service fee (for cash on delivery orders and online paid Orders);",
              "Amount of Payment Mechanism Fee due from Restaurant Partner;",
              "Amount of tax collected by Zomato for Restaurant Service provided through the Zomato Platform;",
              "Any other amounts due to Zomato under the Form or for other services availed with consent of the Restaurant Partner.",
              "After deduction, Zomato shall remit the Order Value due on a weekly settlement basis (or within 3 bank working days if opted) from receipt of payment.",
              "For weekly settlement, Payment Settlement Day for Orders serviced Monday to Sunday shall be on or before Thursday of following week; if holiday, next working day.",
              "Zomato will allow reasonable time for adjustments for refused payments or refunds, as per RBI guidelines.",
              "The Restaurant Partner authorizes Zomato to set off, withhold, and deduct any amounts owed to any Zomato Group Company from the Net Order Value.",
              "Amounts set off will be considered part of the Service fee payable to Zomato.",
              "Zomato Group Company includes all subsidiaries, affiliates, and successors of Zomato.",
            ],
          },
          {
            heading: "10. Charges",
            info: "",
            list: [
              "In consideration of the Services offered by Zomato to the Restaurant Partner, the Restaurant Partner undertakes to pay charges including Service fee, Payment Mechanism Fee, at the rates set out in the Form.",
              "The Restaurant Partner acknowledges and agrees that where Zomato extends additional support services to the Restaurant Partner and/or Customers and incurs corresponding support costs, or where Zomato issues refunds to the Customers on account of acts or omissions attributable to the Restaurant Partner, including but not limited to, frequent rejection or time-out of Order(s), delay in accepting or handing over the Order(s), poor quality food, missing or incorrect item, poor quality packaging, etc, as may be communicated to the Restaurant Partner in the periodic reports, Zomato reserves the right to charge additional amount(s) as highlighted below:",
              "Charges for Orders requiring support: If Orders requiring support exceed more than 5% of weekly Order volume: INR 10.00 per Order for all Orders requiring support. Effective Date. Exception for new Restaurant for two (2) weeks from the Effective Date. The Restaurant Partner agrees that this amount will be deducted from its ongoing payouts.",
              "Charges for Restaurant Partner rejected Orders: If weekly Restaurant Partner rejected Orders exceed more than 0.5% of weekly Order volume: 10% of the Net Order Value of all Restaurant Partner rejected Orders, for the relevant week(s).",
              "If weekly Restaurant Partner rejected Orders exceed more than more than 2% of weekly Order volume : 25% of the Net Order Value of all Restaurant Partner rejected Orders, for the relevant week(s). Effective Date. Exception for new Restaurant for two (2) weeks from the Effective Date. The Restaurant Partner agrees that this amount will be deducted from its ongoing payouts.",
              "Orders requiring support: Orders where support teams extend additional support to mitigate customer escalations including but not limited to, delay in accepting or handing over the Order(s), poor quality food, missing or incorrect item, poor quality packaging, etc.",
              "Restaurant Partner rejected Orders: Orders which are not accepted (i.e., on account of rejection or inaction resulting in time-out) by the Restaurant Partner or accepted but not fulfilled by the Restaurant Partner.",
              "From time to time, Zomato may change the fees for the Services, including without limitation the Service fee rates, Payment Mechanism Fee, any other charges/fees or include any additional charges/fee, with intimation to the Restaurant Partner seven (7) days prior to the date such change(s) or additional charges are to take effect.",
            ],
          },
          {
            heading: "11. Taxes",
            info: "",
            list: [
              "Notwithstanding anything to the contrary herein, the Restaurant Partner is, and will be, responsible for all taxes, payments, fees, and any other liabilities associated with the computation, payment, and collection of taxes in connection with Customer Orders for supply other than Restaurant Service and the Restaurant Partner’s use of the Platform and Zomato Services.",
              "Zomato may charge and collect applicable taxes from Customers on behalf of the Restaurant Partner in accordance with instructions provided by the Restaurant Partner and/or applicable law; and, in which case, Zomato will collect such tax solely on behalf of the Restaurant Partner and shall pay such amount collected to the Restaurant Partner.",
              "The Restaurant Partner shall be solely responsible for verifying amounts collected, filing the appropriate tax returns, and remitting the proper amount to the appropriate tax authorities.",
              "Taxes shall include all applicable taxes due in relation to the sale of food and beverages, including pick-up and delivery services (if applicable), by the Restaurant Partner.",
              "It is clarified that Zomato will not be liable for payment of any Taxes that the Restaurant Partner is liable to pay in connection with supply other than Restaurant Services which shall be provided by the Restaurant Partner to the Customers in accordance with these Terms and that the Restaurant Partner hereby undertakes to indemnify, defend and hold harmless, Zomato and each of its affiliates and (as applicable) all of their directors, officers employees, representatives and advisors against any tax liability that may arise against Zomato on account of the non-payment of Taxes by the Restaurant Partner under these Terms.",
              "Restaurant Partner will be required to deposit relevant taxes, including tax deducted at source (TDS) on the service fee payable to Zomato.",
              "However, in case where Zomato withholds its Service fee before remitting the settlement dues to the Restaurant Partner, Zomato shall refund the TDS to the Restaurant Partner subject to submission of the TDS certificate on a quarterly basis within sixty (60) days from the end of the quarter.",
              "Tax paid by Zomato on Restaurant Service under GST laws ('Tax u/s 9(5') of Central Goods and Services Tax Act, 2017:",
              "W.e.f. 01 January 2022, notwithstanding anything to the contrary herein, Zomato is, and will be, responsible for payment and collection of taxes in connection with Customer Orders of Restaurant Service.",
              "Zomato will collect applicable taxes from Customers on behalf of the Restaurant Partner in accordance with GST laws and deposit the same to the proper amount to the appropriate tax authorities.",
              "Taxes shall include all applicable taxes due in relation to the supply of Restaurant Service including pick-up and delivery services (if applicable), by the Restaurant Partner.",
              "Restaurant Partner(s) will be required to deposit relevant taxes, including tax deducted at source (TDS) on the service fee payable to Zomato.",
              "However, in case where Zomato withholds its Service fee before remitting the settlement dues to the Restaurant Partner, Zomato shall refund the TDS to the Restaurant Partner subject to submission of the TDS certificate on a quarterly basis within sixty (60) days from the end of the quarter.",
              "For the purpose of clarification, as per Section 9(5) of Central Goods and Services Tax Act, 2017, with effect from 1 January 2022, tax on supply of specified Restaurant Service supplied by Restaurant(s) through e-commerce platform shall be paid by such e-commerce operators.",
              "Tax collected at source:",
              "W.e.f. 01st October, 2018, Zomato is required to collect taxes at source on Gross Sales (less applicable taxes charged by Restaurant(s) on Supply of Food and Beverages Items other than supply of Restaurant Service, at such rates as required by the applicable tax laws (“TCS”).",
              "The TCS shall be collected on the date of acceptance of Order.",
              "The Restaurant Partner shall be solely responsible to provide correct GSTIN details to Zomato and reconcile the TCS with the tax statements provided by Zomato from time to time, as required by applicable laws.",
              "Zomato shall remit TCS to the respective Central Government and State Government/Union Territory and such remittance(s) shall be considered as complete fulfillment of Zomato's obligations in this regard.",
              "The Restaurant Partner may be eligible to claim TCS credit on the basis of tax returns filed by it with the relevant government/statutory/tax authorities.",
              "Restaurant Partner acknowledges and agrees that in the event of any discrepancy between the tax returns/entries filed by Restaurant Partner and those filed by Zomato, the tax returns/entries present and filed by Zomato shall have a precedence over the tax returns/entries filed by Restaurant Partner.",
              "Zomato shall share a monthly TCS statement along with invoice with Restaurant Partner to report transactions undertaken during the month in its applicable returns.",
              "Tax Deducted at Source under Income Tax Act (‘TDS u/s 194-O’):",
              "W.e.f. 01st October, 2020, Zomato is required to deduct taxes at source from the amount for all Orders that are settled via Zomato’s Platform.",
              "TDS u/s 194-O shall be applied on Gross Sales (less applicable taxes charged by the Restaurant) as per the applicable tax law on the rate as applicable and amended from time to time.",
              "Zomato hereby clarifies that TDS u/s 194-O shall be deducted under the Payment Settlement Process set out in the Form and these Terms.",
              "The Restaurant Partner shall be solely responsible to provide correct PAN details to Zomato and reconcile the income tax deducted with the order transaction report and certificates provided by Zomato from time to time.",
              "Zomato shall remit income tax deducted to the respective Government account and report against the PAN as available on Zomato records.",
              "Such remittance(s) and reporting shall be considered as complete fulfilment of Zomato's obligations in this regard.",
              "Zomato will share a quarterly TDS certificate with Restaurant Partner as per applicable tax law.",
              "The Restaurant Partner may be eligible to claim credit of the income tax deducted on the basis of tax returns filed by it with the relevant government tax authorities.",
              "Restaurant Partner acknowledges and agrees that it is the Restaurant Partner’s responsibility to reconcile and claim correct credit for the income tax deducted for which the Restaurant Partner may be eligible as per the applicable laws.",
              "Restaurant Partner also agrees that in the event of any discrepancy between the returns filed by the Restaurant Partner and those filed by Zomato, the amount reported by Zomato shall have a precedence over the tax returns filed by the Restaurant Partner.",
              "Any discrepancy identified at the time of reconciliation by the Restaurant Partner should be brought to the attention of Zomato within a period of fifteen (15) days from the date of receipt of TDS Certificate.",
              "Any delay on this account will relieve Zomato of any obligation to undertake a corrective action to resolve the discrepancy.",
              "Under no circumstances, Zomato shall entertain any discrepancy in the reported value after 31st July of the year following the financial year to which the transactions were undertaken and reported.",
              "Restaurant Partner agrees and acknowledges that Zomato shall not be held liable in any manner in the event the Restaurant Partner does not receive the benefit of income tax deducted due to incorrect particulars provided by the Restaurant Partner to Zomato.",
            ],
          },
          {
            heading: "12. Confidentiality",
            info: "",
            list: [
              "i. Other than for provision of Service(s) by Zomato, Zomato does not share any other information of the Restaurant Partner with third parties unless requisitioned by government authorities.",
              "ii. Other than for the purpose of availing Service(s) from Zomato, the Restaurant Partner must not disclose any confidential information about Zomato, including but not limited to these Terms, its business strategies, pricing, revenues, expenses, Customer Data, and Order information to third parties.",
            ],
          },

          {
            heading: "13. Warranty and Indemnity",
            info: "",
          },

          {
            heading: "14. Customer Data",
            info: "The Restaurant Partner agrees that the Restaurant Partner will only use the Customer Data in fulfilling the applicable Customer Order and in complying with the Restaurant Partner's obligations in this Form, and the Restaurant Partner agrees that Customer Data will not be used to enhance any file or list of the Restaurant Partner or any third party. The Restaurant Partner represents, warrants, and covenants that it will not resell, broker or otherwise disclose any Customer Data to any third party, in whole or in part, for any purpose whatsoever. The Restaurant Partner agrees it shall not use the Customer Data for sending any unsolicited marketing message, announcements and for feedback purposes, and shall be solely liable to ensure that any third party with whom Customer Data is shared complies with the restrictions set forth herein. The Restaurant Partner agrees that it will not copy or otherwise reproduce any Customer Data other than for the purpose of fulfilling the applicable Customer Order. The Restaurant Partner (and any other persons to whom the Restaurant Partner provides any Customer Data) will implement and comply with reasonable security measures in protecting, handling, and securing the Customer Data. If any Customer Data is collected by the Restaurant Partner (or otherwise on its behalf), the Restaurant Partner shall ensure that it (and any applicable third parties) adopt, post, and process the Customer Data in conformity with an appropriate and customary privacy policy. For purposes of this Form, the restrictions set forth herein on the Restaurant Partner's use of Customer Data do not apply to: (a) data from any Customer who was a customer of Restaurant Partner prior to the Restaurant Partner using the Platform or the Zomato Services, but only with respect to data that was so previously provided to the Restaurant Partner by such Customer; or (b) data supplied by a customer directly to the Restaurant Partner who becomes a customer of the Restaurant Partner and who explicitly opts in to receive communications from the Restaurant Partner for the purposes for which such Customer Data will be used by Restaurant Partner; and, provided in all cases, that the Restaurant Partner handles and uses such Customer Data in compliance with applicable Laws and the Restaurant Partner's posted privacy policy.",
          },

          {
            heading: "15. Term and Termination",
            info: "",
            list: [
              "Arrangement starts on the Execution Date and continues indefinitely unless terminated earlier.",
              "Either party may terminate the arrangement with or without cause by providing seven (7) days prior written notice.",
              "Zomato may terminate or suspend services immediately if:",
              "The Restaurant Partner fails to conduct business in accordance with the Terms or information provided to Zomato (e.g., proprietary rights, opening hours, delivery areas, nature of food served, or prices).",
              "The user experience for the Restaurant Partner is not satisfactory as per Zomato standards.",
              "The Restaurant Partner fails to deliver non-fraudulent orders for 14 consecutive days.",
              "Insolvency events such as bankruptcy, appointment of a receiver, administrator, liquidator, winding up, or dissolution occur.",
              "Fraudulent or suspicious activity is identified on the Restaurant Partner’s account.",
              "The Restaurant Partner fails to comply with Applicable Law or the Terms.",
              "Zomato conducts an investigation to ensure compliance with Applicable Law or the Terms.",
              "Either party may terminate with immediate effect by written notice in case of a material breach not remedied within 14 days after notice specifying the default.",
              "Termination does not affect accrued rights or liabilities at the date of termination.",
              "Termination does not impact valid services issued to customers or payment obligations for services availed.",
              "Zomato may suspend or terminate services immediately upon notice for:",
              "Suspicious activity by the Restaurant Partner.",
              "Breach of Zomato’s or a third party’s intellectual property rights.",
              "False misrepresentation by the Restaurant Partner.",
              "Fraudulent activity.",
              "Zomato may withhold, set off, or deduct payments due to the Restaurant Partner.",
              "Amounts withheld are deemed part of the service fee payable by the Restaurant Partner.",
            ],
          },

          {
            heading: "16. Notice requirements",
            info: "Factors that prevent you from fulfilling your obligations towards Zomato or Customers should promptly be reported to Zomato by contacting the account manager appointed by Zomato or by writing an email to priority@zomato.com.",
          },
          {
            heading: "17. Disclaimers",
            info: "To the fullest extent permitted by law, Zomato and its affiliates, and each of their respective officers, directors, members, employees, and agents disclaim all warranties, express or implied, in connection with this Form, the Platform and the Zomato services and any use thereof, including, without limitation, the implied warranties of merchantability, fitness for a particular purpose and non-infringement. Zomato makes no warranties or representations about the accuracy or completeness of the content and data on the Platform or the Zomato services' content or the content of any other websites linked to the website, and assumes no liability or responsibility for any (a) errors, mistakes, or inaccuracies of content and materials, (b) personal injury or property damage, of any nature whatsoever, resulting from the Restaurant Partner's access to and use of the Platform and the Zomato services, (c) any unauthorized access to or use of Zomato' servers and/or any and all personal information and/or financial information stored therein, (d) any interruption or cessation of transmission to or from the website or otherwise with respect to the Zomato services, (e) any bugs, viruses, trojan horses, or the like which may be transmitted to or through the website or the Zomato services by any third party, and/or (f) any errors or omissions in any content and materials or for any loss or damage of any kind incurred as a result of the use of any content posted, transmitted, or otherwise made available via the website or the Zomato Services.",
          },
          {
            heading: "18. Limitation of Liability",
            info: "For the purposes of this clause, Liability means liability in or for breach of contract, negligence, misrepresentation, tortious claim, restitution or any other cause of action whatsoever relating to or arising under or in connection with this Form, including liability expressly provided for under this Form or arising by reason of the invalidity or unenforceability of any term of this Form. Zomato does not exclude or limit Liability for any Liability that cannot be excluded by law. Subject to the preceding sentence, Zomato shall not be under any Liability for loss of actual or anticipated profits, loss of goodwill, loss of business, loss of revenue or of the use of money, loss of contracts, loss of anticipated savings, loss of data and/or undertaking the restoration of data, fraudulent Orders, any special, indirect or consequential loss, and such liability is excluded whether it is foreseeable, known, foreseen or otherwise. For the avoidance of any doubt, this clause shall apply whether such damage or loss is direct, indirect, consequential or otherwise. Although Zomato will use its best endeavours to ensure that the unintentional operational errors do not occur, Zomato cannot provide any warranty or guarantee in this regard. Notwithstanding anything to the contrary herein set out, Zomato’s aggregate liability under this Form shall not exceed the total value of the Order under which the claim arose.",
          },
          {
            heading: "19. Miscellaneous",
            info: "",
            list: [
              "Governing Law and Dispute Resolution: This Form shall be governed by the Laws of India, with the courts of New Delhi having exclusive jurisdiction. Parties must first attempt to resolve disputes amicably within fifteen (15) days before referring them to court.",
              "Waiver: Failure by either party to assert any rights under the Form does not constitute a waiver of those rights to enforce provisions later.",
              "Invalidity or unenforceability of any provision does not affect the validity or enforceability of the remaining provisions.",
              "No third-party rights: No term of this Form is enforceable by a third party.",
              "No assignment: The Restaurant Partner cannot assign, transfer, charge, encumber, create a trust over, or deal with the Form or its rights/obligations under it.",
              "Independent contractors: The Form does not establish an agency, employment, partnership, joint venture, or similar relationship. Zomato and the Restaurant Partner act as independent contractors.",
              "Change of control: The Restaurant Partner consents to the transfer of its personal information and the Form to any future purchaser of Zomato’s business or assets.",
              "Acceptance of Zomato’s Privacy Policy: By signing the Form, the Restaurant Partner agrees to be bound by Zomato’s privacy policy and must notify Zomato immediately of any unauthorized use or access to user data or Confidential Information, cooperating in investigations and mitigation efforts.",
            ],
          },
          {
            heading: "20. Modification",
            info: "Zomato may modify these Terms from time to time, and any such changes will (i) be reflected on the Website, and (ii) be effective immediately upon the changes being reflected on the Platform. The Restaurant Partner agrees to be bound to any such changes or modifications and understands and accepts the importance of regularly reviewing these Terms as updated on the Platform.\n\nFurther, in the event Zomato upgrades, modifies or replaces the Services (Service Modifications) offered to the Restaurant Partner, Zomato will notify the Restaurant Partner prior to making the same and give the Restaurant Partner the opportunity to review and comment on the Service Modifications before continuing to use the Service or any alternative service offered by Zomato. The Service Modifications will also be reflected on the Platform. If the Restaurant Partner continues to use the Service or any alternate service offered by Zomato, following any notice of the Service Modifications, it shall constitute the Restaurant Partner’s acceptance of such Service Modifications.",
          },
        ],
      },
    },
  ];
  const contentDining = [
    {
      index: "India",
      content: "",
      subsections: {
        heading:
          "Terms and Conditions of Merchant Enrolment Form for Zomato Dining (“Terms”)",
        subheading: [
          {
            heading: "",
            info: `These Terms forms an integral part of the Merchant Enrolment Form for Zomato Dining (“Form”) and constitute a legally binding agreement made between you, whether personally or on behalf of an entity (the “Merchant”), and Zomato Limited (formerly known as Zomato Private Limited and Zomato Media Private Limited) (“Zomato”), wherein the Merchant agrees to extend Offer(s) to the Customer (as defined below).`,
          },
          {
            heading: "1. DEFINITIONS",
            info: "",
            list: [
              "Bill means the invoice raised for the Bill Value on the Customer by the Restaurant Partner towards the sale of Goods at the Restaurant.",
              "Bill Value means the total amount in Indian Rupees set out in the Bill towards the Goods and services availed by the Customer at the Restaurant and shall include applicable taxes, service charge and other charges as may be applicable.",
              "Commencement Date means the date set out in the Form or any other such date as notified by Zomato via email, whichever is later, from which the Merchant shall extend the Offer(s) to the Customer.",
              "Customer means a user, who pays the Bill Value through the Zomato Application (as defined below).",
              "Customer Data means any and all identifiable information about Customer provided by the Customer via the Zomato Application, including, but not limited to, Customer’s name, delivery addresses, email addresses, phone numbers, and Customer preferences, to be governed by the privacy policy located at https://www.zomato.com/policies/privacy.",
              "Commission means the amount payable by the Merchant to Zomato, being a percentage (%) of Net Sales as set out in the Form.",
              "Electronic Payment Mechanism means the online and mobile-based payment mechanisms including third-party payment gateways, credit card/debit card/net banking transfer and/or e-wallets and/ or any loyalty points that are available on the Zomato Application for the purposes of facilitating the payment of Net Sales and Tips (if any) payable by the Customer.",
              "Goods means the food items and beverages which are sold by the Merchant at the Restaurant.",
              "Information means the information set out and provided along with the Form, Zomato Dashboard and includes any information which is supplied by the Merchant to Zomato under these Terms such as the menu, the price lists underlying the menu, opening hours of the restaurants operated by the Merchant, rates at which taxes are charged by the Merchant to the Customer, specific information the Restaurant Partner is under an obligation to supply to Zomato (a) immediately on the Execution Date; or (b) within one (1) day from any change in such information.",
              "Merchant means the owner/operator of the Restaurant as mentioned in the Form.",
              "Net Sales means the Bill Value payable by a Customer to the Merchant towards the Goods and services availed by the Customer at the Restaurant less the Offer(s) offered by the Restaurant.",
              "Offer(s) shall include, but not be restricted to (i) percentage of discount that the Merchant agrees to extend to the Customers (including a Customer availing Zomato Gold (as defined below) membership), on the Bill Value for each Transaction; (ii) percentage of discount(s)/promotional offer(s) that the Merchant may extend to the Customers in partnership with banking institutions and/or third parties; or (iii) any other discount(s)/promotional offer(s) as may be agreed between the Parties from time to time.",
              "Order means the placement of an order by the Customer with the Merchant at the Restaurant for the purchase of Goods at the Restaurant directly.",
              "Parties means Zomato and the Merchant.",
              "Restaurant means the establishment(s) for which the Merchant is executing the Form.",
              "Tips means the amount voluntarily paid by Customers to the Restaurant at its sole discretion through the Zomato Application.",
              "Transaction means each instance where the Customer makes payments towards the Bill Value via the Zomato Application.",
              "Validity Period means from the date the Offer(s) is made available by the Merchant to Customers and during which the Merchant is not permitted to modify the Offer(s).",
              "Weekends means the period starting from Friday 4:00 am until Monday 4:00 am.",
              "Zomato Application means the mobile application, owned and operated by Zomato.",
              "Zomato Dashboard means the Zomato owned merchant interface platform, the access to which is provided by Zomato to the Merchant.",
              "Zomato Gold means the subscription-based membership program offered to Customers for a prescribed period and for a fee.",
            ],
          },
          {
            heading: "2. MERCHANT COVENANT’S",
            info: "",
            list: [
              "The Merchant hereby agrees to extend the Offer(s) to Customer in accordance with the terms set out in the Form and these Terms on and from the Commencement Date.",
              "The Merchant will determine the Offer(s) via the Zomato Dashboard, which will be honoured by the Merchant through the Validity Period.",
              "The Offer(s) once determined by the Merchant, shall be applicable for the minimum Validity Period, during which the Merchant will not be permitted to modify the Offer(s). Any modification to the Offer(s) can only be made by the Merchant after the expiry of the Validity Period and will take two days thereafter to be effective and applied on any Transaction.",
              "The Merchant shall ensure that it has all rights, title, and interest in the content shared by the Merchant with Zomato including but not limited to any artwork(s), creative(s), logo(s), picture(s), video(s), music, and write-up(s), banner(s), image(s) to be displayed on the Zomato Application ('Content'). You further agree to grant Zomato and its affiliates a non-exclusive, royalty-free, irrevocable and perpetual right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, upload and display the Content, on the Zomato Application.",
              "The Merchant shall provide all Content with respect to the Restaurant to be used for the purpose of promotions on the Zomato Application. Merchant shall ensure that it has all rights, title and interest in the Content it shares with Zomato.",
              "The Merchant shall ensure that the Content is compliant with the applicable laws and the content guidelines as set out in these Terms.",
              "The Merchant shall ensure that such Content displayed on the Zomato Application is not unlawful, misleading, fraudulent, illegal, or unauthorized.",
              "The Merchant acknowledges that Zomato shall in no manner be liable for the Content displayed on the Zomato Application, when such Content is provided by the Merchant. The Merchant hereby agrees and acknowledges that Zomato shall be authorised to use the logo and brand name of the Restaurant or the Merchant as the case may be for the purpose of advertisement of the Offer(s).",
              "In the event the Merchant has an ongoing collaboration with a third party and wishes to promote such collaboration on the Zomato Application, the Merchant shall provide Zomato with a letter from such third party acknowledging the collaboration along with a no-objection letter from such third party (in a format acceptable to Zomato).",
              "The Merchant hereby permits Zomato to advertise and extend the Offer(s) to the Customer on behalf of the Restaurant.",
              "The Merchant hereby authorizes Zomato to collect Net Sales and Tips (if any) from the Customer on behalf of the Merchant.",
              "The Merchant shall extend the Offer(s) to all Customers.",
              "The Merchant hereby agrees not to extend any discount/offers similar or lower to the Offer(s) agreed during the Validity Period to the Customer directly or through any third party.",
              "The Merchant shall not, directly or indirectly discriminate, discourage, solicit or refuse a Customer from availing the Offer(s), from subscribing to Zomato Gold and/or from making payment of the Net Sales via the Zomato Application.",
              "The Merchant hereby agrees that where it levies service charge at its Restaurant, it shall apply the same uniformly to all the Customers availing services of the Restaurant and shall not in any event discriminate in levying the service charge between a Customer availing Zomato Gold and a non-Zomato Gold Customer.",
              "The Merchant permits Zomato to deduct from Net Sales, the Commission and any other amount(s) payable by the Merchant to Zomato under the Form or these Terms, and transfer such remaining amounts to the Merchant in accordance with the payment settlement process set out in the Form.",
              "The Merchant will not charge any additional amount, over and above the Net Sales, from the Customer paying the Bill via the Zomato Application.",
              "The Merchant shall ensure that all mandatory information pertaining to taxes, levies and charges applicable on the Bill are clearly visible to the Customers on the Bill as per applicable laws.",
              "The Merchant hereby permits Zomato to contact the Merchant by phone, email, SMS, or other modes of communication, for the purpose of giving feedback or for the purpose of facilitation of any issue in connection with the terms of the Form and these Terms.",
              "The Merchant and its representatives shall honour the Offer(s) requested by a Customer irrespective of the number of people seated on the table. For the purpose of clarity, all individuals seated on the table are not required to be Customers (as defined in these terms).",
              "The Merchant agrees and acknowledges that Zomato reserves the right to advertise the Offer(s) extended by other restaurants as well, as a part of other services as well (including Zomato Gold program).",
              "The Merchant agrees that the Offer(s) cannot be combined with any other ongoing offers, discounts or deals extended by the Merchant at the Restaurant.",
              "Notwithstanding anything otherwise set out herein, the Merchant shall, at all times remain, solely liable for (a) the goods and/or services, rendered to a Customer at the Restaurant; (b) any in-person interactions with the Customer by the Merchant and or its representatives; (c) payment of all applicable taxes and statutory dues with respect to the goods and services offered and charged by the Restaurant and the Offer(s) extended to the Customer and compliance with all applicable laws; (d) the Customer’s experience at the Restaurant; and (e) in the event the Merchant or its representative do not honor the Offer(s) which a Customer desires to avail, Zomato reserves the right to contact the Customer telephonically or via email and/or SMS or by any other means of communication regarding the Customer’s experience and such response of the Customer shall be communicated by Zomato to the Merchant.",
              "The Merchant hereby represents to Zomato that it is in compliance with all rules and regulations prescribed by extant excise laws and that it has a valid license to sell liquor and/or alcoholic beverages at the Restaurant.",
              "The Merchant will ensure that the Information provided to Zomato is current and accurate, including but not limited to the Merchant name, address, contact telephone number, email, manager/contact person details, delivery times, opening hours, menus, price lists, taxes, service addresses, and other relevant information. Where the Merchant has a unilateral right to access to Zomato Dashboard to edit and update the Information which is displayed on the Zomato Application, the Merchant should ensure that it (i) keeps such information true, accurate and updated at all times; and (ii) complies with Zomato’s internal terms and conditions of use in this regard.",
            ],
          },
          {
            heading: "3. CONTENT GUIDELINES",
            info: "For the purpose of Zomato Dining, the Merchant agrees to not post or transmit any Content that:",
            list: [
              "is plagiarized",
              "contains sexually explicit, defamatory, obscene, or unlawful materials",
              "contains blurry or unclear photos",
              "contains unpleasant photos that ruin people's experience",
              "contains content or advertisement prohibited by applicable laws",
              "is harmful, threatening, abusive, harassing, tortious, indecent, defamatory, discriminatory, vulgar, profane, libelous, hateful, objectionable, invasive of privacy, or encouraging money laundering or gambling",
              "constitutes an inauthentic or knowingly erroneous review, or does not address the goods and services, atmosphere, or other attributes of the business",
              "violates any third-party rights, including but not limited to privacy, publicity, copyright, trademark, patent, trade secret, or other proprietary rights",
              "accuses others of illegal activity, describes physical confrontations, or impersonates another person or entity",
              "advertises for sale any item prohibited by law, including hazardous food or tobacco products",
              "alleges health code violations requiring healthcare department reporting",
              "is illegal or violates any central, state, or local law or regulation",
              "constitutes deceptive advertising or causes/derives from a conflict of interest",
              "includes spam, surveys, contests, pyramid schemes, or postings removed in exchange for payment",
              "asserts or implies the content is sponsored or endorsed by Zomato",
              "falsely states, misrepresents, or conceals affiliation with another person or entity",
              "distributes computer viruses or code that interrupts or limits software/hardware functionality",
              "hacks or accesses without permission proprietary or confidential records",
              "violates contracts or fiduciary relationships (e.g., disclosing proprietary/confidential information)",
              "removes, circumvents, disables, damages, or interferes with security-related features",
              "collects, accesses, or stores personal information about other users",
              "is posted by a bot",
              "harms minors in any way",
              "threatens the unity, integrity, defense, security, or sovereignty of India, friendly relations with foreign states, or public order",
              "modifies, copies, scrapes, crawls, displays, publishes, licenses, sells, rents, or commercializes rights to Zomato's content",
              "is patently false and untrue, written with intent to mislead or harass for financial gain or to cause injury",
            ],
          },
          {
            heading: "4. ZOMATO COVENANT’S",
            info: "",
            list: [
              "Zomato will provide an Electronic Payment Mechanism to the Customers to make payments towards Net Sales and Tips (if any).",
              "Zomato will transfer the Net Sales collected from the Customers, less the Commission and any other amount(s) payable by the Merchant to Zomato under the Form or these Terms, to the Merchant in accordance with the terms of the Form read along with the Terms.",
              "Zomato will deduct tax collected at source from the Net Sales after adjusting for taxes.",
              "Zomato will have the right to remove/suspend advertising the Merchant and the Offer(s) from the Zomato Application at any time at its sole discretion.",
            ],
          },
          {
            heading: "5.COMMISSION",
            info: "",
            list: [
              "a. The Merchant undertakes to pay to Zomato, (i) Commission at the rates set out in the Form and (ii) the Merchant’s share (up to 20%) of any discount(s)/promotional offer(s) that Zomato may extend to the Customers in partnership with banking institutions and/or third parties.",

              "b. The Parties hereby agree that from time to time, Zomato may change the Commission rates or include any additional charges/ fee, provided however, that Zomato shall communicate any such change(s) via email or any other modes of communication to the Merchant with a prior intimation of forty-five (45) days.",
            ],
          },
          {
            heading: "6. Payment Settlement Process",
            info: "",
            list: [
              "The Merchant acknowledges and agrees that any Net Sales and Tips (if any) collected by Zomato for, and on behalf of the Merchant in accordance with these Terms, shall be passed on by Zomato to the Merchant subject to the deduction of the following amounts by Zomato: " +
                "(i) Commission and any taxes as applicable thereon; " +
                "(ii) Taxes as applicable; " +
                "(iii) Any other amounts or charges that are due to Zomato under the Form and/or the Terms.",
              "Notwithstanding anything to the contrary contained in these Terms or the Form, the Merchant, on behalf of itself and all its affiliates, unconditionally and irrevocably authorizes Zomato to set off, withhold and deduct any amounts owed by the Merchant or its affiliates to any Zomato Group Company under any agreement, arrangement, or understanding, from the Net Sales, and apply such amounts towards the dues owed by the Merchant or its affiliates. These amounts shall be deemed part of the Commission payable by the Merchant to Zomato.",
              "The Parties acknowledge and agree that after the deduction of amounts set out in Clause 5 (a) and 5 (b), Zomato shall remit the Net Sales due to the Merchant as per the Payment Settlement Day specified in the Form.",
              "If the Payment Settlement Day falls on a bank holiday or a non-business day, the payment shall be processed on the next working day.",
              "The Merchant acknowledges and agrees that Zomato will provide the Merchant with a monthly invoice within 7 days from the last date of the preceding month for the Commission, Payment Gateway Fee, and other amounts due and payable by the Merchant to Zomato.",
              "Invoices will be sent to the Merchant on the dashboard access provided by Zomato. All invoices shall be issued from Zomato’s registered office in the relevant State to comply with GST laws. A list of Zomato’s registered offices is available at https://www.zomato.com/licenses.",
              "The Merchant acknowledges and agrees that all amounts payable to Zomato under these Terms shall be exclusive of applicable taxes, which will be charged separately.",
              "The Merchant is responsible for all taxes, payments, fees, and liabilities associated with the computation, payment, and collection of taxes related to the Bill and the Merchant’s use of the Zomato Application. Zomato is not liable for taxes the Merchant is responsible for, including those related to Goods provided by the Merchant. The Merchant must indemnify Zomato against any tax liabilities arising due to non-payment of taxes by the Merchant. Relevant taxes, including TDS on Zomato's commission, must be deposited by the Merchant. Zomato will refund TDS to the Merchant upon submission of the TDS certificate quarterly within 60 days from the end of the quarter.",
              "Notwithstanding the aforesaid, Zomato reserves the right to set off, withhold, and/or deduct payments due to Zomato under the Form against any payments payable by Zomato under any other agreement or arrangement with the Merchant or its affiliates.",
            ],
          },
          {
            heading: "7. TERM AND TERMINATION",
            info: "",
            list: [
              "The arrangement between the parties shall commence from the Commencement Date and shall be valid and binding on the parties, unless terminated in accordance with these Terms.",
              "Either Party may terminate the Form and the Terms by issuing a thirty (30) days prior written notice of termination to the other Party.",
              "Notwithstanding anything to the contrary contained herein, Zomato may forthwith terminate the agreement or suspend the Restaurant if: " +
                "(i) the Merchant is in breach of these Terms and/or the terms and conditions of the Form, which, if capable of remedy, is not remedied within fourteen (14) days after intimation is given to the Merchant specifying the default; " +
                "(ii) upon the happening of any insolvency events such as bankruptcy, appointment of a receiver, administrator, liquidator, winding up, or dissolution; " +
                "(iii) the Merchant fails to comply with applicable law.",
              "The Merchant hereby agrees and acknowledges that Zomato shall exercise its right to terminate the Form and the Terms in accordance with Clause 6 above, and the arrangement shall be deemed to be completed and fulfilled with the Merchant by Zomato without any liability to the Merchant under the Form and these Terms.",
            ],
          },
          {
            heading: "8. LICENSE",
            info: "Merchant hereby grants Zomato an unrestricted, non-exclusive, royalty-free license in respect of all content and information provided to Zomato by the Merchant for the purposes of inclusion on the Zomato Application and as may be otherwise required under the Form. This includes, but is not limited to, a) use of the Merchant’s name in the context of Google ad words to support advertising and promotional campaigns to promote offer(s) on internet which may be undertaken by Zomato b) preparation of derivative works of, or incorporate into other works, all or any portion of the marketing materials which will be made by Zomato for the purposes of its business. Any Content with respect to the Restaurant to be used for the purpose of promotions on the Zomato Application which the Merchant transmits or submits to Zomato either through the Zomato Application or otherwise shall be considered and may be treated by Zomato as non-confidential, subject to Zomato’s obligations under relevant data protection legislation. The Merchant also grants to Zomato a royalty-free, perpetual, irrevocable, non-exclusive license to use, copy, modify, adapt, upload, translate, publish and distribute world-wide any Content for the purposes of providing services under these Terms or to or for the purposes of advertising and promotion of the Zomato Application. The Merchant agrees that all information provided to Zomato that is published, may be relied upon and viewed by Customers to enable them to make decisions.",
          },
          {
            heading: "9. CONFIDENTIALITY",
            info: "Any confidential or proprietary information of either party, whether of a technical, business or other nature, including, but not limited to consumer information/ Customer Data, trade secrets, know-how, technology and information relating to customers, business plans, promotional and marketing activities, finances and other business affairs, including but not limited to these Terms (collectively, “Confidential Information”) disclosed to the receiving party by the disclosing party, including Confidential Information disclosed before the date of signing the Form, will be treated by the receiving party as confidential and proprietary. These Terms shall be considered Zomato’s Confidential Information. Unless specifically authorized by the disclosing party, the receiving party will: (a) not use such Confidential Information except as authorized by the disclosing party; (b) not disclose such Confidential Information to any third party; and (c) otherwise protect such Confidential Information from unauthorized use and disclosure to the same extent that it protects its own Confidential Information of a similar nature. This section will not apply to any information that: (i) was already known to the receiving party, other than under an obligation of confidentiality, at the time of disclosure by the disclosing party; (ii) was generally available to the public or otherwise part of the public domain at the time of its disclosure to the receiving party; (iii) became generally available to the public or otherwise part of the public domain after its disclosure and other than through any act or omission of the receiving party in breach of these Terms; (iv) was disclosed to the receiving party, other than under an obligation of confidentiality, by a third party who had no obligation to the other party not to disclose such information to others; or (v) was developed independently by the receiving party without any use of Confidential Information.",
          },
          {
            heading: "10. WARRANTY AND INDEMNITY",
            info: "",
            list: [
              "Merchant warrants that if the Merchant ceases to do business, closes operations for a material term, then the Merchant shall provide Zomato a prior thirty (30) days written notice, failing which the Merchant shall indemnify Zomato for any claims or disputes that may arise on account of the aforementioned acts of the Merchant.",
              "The Merchant hereby unconditionally represents to Zomato that it shall at all times be in compliance with the conditions imposed upon it by any license issued by any rule/regulation/statute.",
              "Merchant will ensure that it complies with and remains in compliance with all applicable Indian laws and all other applicable legislation, regulations, or standards.",
              "The Merchant agrees to indemnify and hold Zomato harmless (and its directors, officers, agents, representatives, and employees) from and against any and all claims, suits, liabilities, judgments, losses, and damages arising out of or in connection with any claim or suit or demand: " +
                "(i) on account of breach of these Terms by the Merchant; " +
                "(ii) in respect of, arising out of, or in connection with the Offer(s) extended by the Merchant; " +
                "(iii) the quality of the Goods offered by the Merchant; " +
                "(iv) the Content shared by the Merchant with Zomato and/or on the Zomato Application; " +
                "(v) any statutory proceedings which may arise out of any acts of omission or commission by the Merchant in relation to the applicable excise laws; " +
                "(vi) on account of any non-compliance of a condition under the license issued by any rule/regulation/statute.",
              "Zomato warrants that it will undertake its obligations with reasonable skill and care. Zomato does not guarantee or warrant that the Zomato Application will be free from defects or malfunctions. If errors occur, it will use its best endeavours to resolve these as quickly as possible.",
            ],
          },
          {
            heading: "11. CUSTOMER DATA",
            info: "The Merchant agrees that the Merchant will only use the Customer Data in fulfilling and in complying with the Merchant's obligations in these Terms, and the Merchant agrees that Customer Data will not be used to enhance any file or list of the Merchant or any third party. The Merchant represents, warrants, and covenants that it will not resell, broker or otherwise disclose any Customer Data to any third party, in whole or in part, for any purpose whatsoever. The Merchant agrees that it will not copy or otherwise reproduce any Customer Data other than for the purpose of fulfilling its obligations under this Form and Terms. The Merchant (and any other persons to whom the Merchant provides any Customer Data) will implement and comply with reasonable security measures in protecting, handling, and securing the Customer Data. If any Customer Data is collected by the Merchant (or otherwise on its behalf), the Merchant shall ensure that it (and any applicable third parties) adopt, post, and process the Customer Data in conformity with an appropriate and customary privacy policy. For purposes of these Terms, the restrictions set forth herein on the Merchant's use of Customer Data do not apply to: (a) data from any customer who was a customer of Merchant prior to the Merchant using the Zomato Application, but only with respect to data that was so previously provided to the Merchant by such Customer; or (b) data supplied by a customer directly to the Merchant who becomes a customer of the Merchant and who explicitly opts in to receive communications from the Merchant for the purposes for which such Customer Data will be used by Merchant; and, provided in all cases, that the Merchant handles and uses such Customer Data in compliance with applicable Laws and the Merchant's posted privacy policy.",
          },
          {
            heading: "12. LIMITATION OF LIABILITY",
            info: "For the purposes of this Section, Liability means liability in or for breach of contract, negligence, misrepresentation, tortious claim, restitution or any other cause of action whatsoever relating to or arising under or in connection with these Terms and the Form, including liability expressly provided for under these Terms and the Form or arising by reason of the invalidity or unenforceability of any these Terms or the terms of the Form. Zomato does not exclude or limit Liability for any Liability that cannot be excluded by law. Subject to the preceding sentence, Zomato shall not be under any Liability for loss of actual or anticipated profits, loss of goodwill, loss of business, loss of revenue or of the use of money, loss of contracts, loss of anticipated savings, loss of data and/or undertaking the restoration of data, any special, indirect or consequential loss, and such liability is excluded whether it is foreseeable, known, foreseen or otherwise. For the avoidance of any doubt, this Section shall apply whether such damage or loss is direct, indirect, consequential or otherwise. Although Zomato will use its best endeavours to ensure that the unintentional operational errors do not occur, Zomato cannot provide any warranty or guarantee in this regard. Notwithstanding anything to the contrary herein set out, Zomato’s aggregate liability under these Terms and the Form shall not exceed the Bill Value under which the claim arose.",
          },
          {
            heading: "13. NOTICES",
            info: "All notices, demands or consents required or permitted under these Terms shall be provided (i) by email or (ii) in writing and personally delivered or sent by telecopy, telegram or registered or certified mail, return receipt requested, or by a reputable overnight carrier to the address designated by the other party and will be deemed to have been served when delivered, or if delivery is not accomplished by some fault of the addressee, when tendered. If, to Zomato, such papers must be sent to legal@zomato.com to the attention of the Legal Department. The communications between the Merchant and Zomato may employ electronic means, such as email or notifications provided by Zomato to the Merchant. The Merchant agrees (i) to receive communications from Zomato in an electronic form, and (ii) agrees that all terms and conditions, agreements, notices, disclosures, and other communications that Zomato provides electronically satisfy any legal requirement that such communications would satisfy if they were in writing.",
          },
          {
            heading: "14. FORCE MAJEURE",
            info: "Neither party will be liable to the other party for any failure or delay in performance caused by reasons beyond its reasonable control, including but not limited to acts of God, epidemics, earthquakes, strikes, lockdowns, civil disturbances, or similar causes.",
          },
          {
            heading: "15. GOVERNING LAW AND DISPUTE RESOLUTION",
            info: "These Terms shall be governed by the Laws of India, for the time being in force and the courts of New Delhi shall have the exclusive jurisdiction to preside over matters arising hereunder.",
          },
          {
            heading: "16. General",
            info: "",
            list: [
              "Assignment: These Terms shall not be assigned by the Merchant without the prior written consent of Zomato. Any purported transfer, assignment, or delegation without such prior written consent shall be null and void. Zomato may assign or transfer these Terms for any reason to any person. Subject to the foregoing, these Terms shall bind and inure to the benefit of each party’s successors and permitted assigns.",
              "Partial Invalidity: If any provision in these Terms is or becomes illegal, invalid, or unenforceable in any respect under applicable law, neither the legality, validity, nor the enforceability of the remaining provisions will in any way be affected or impaired. Further, the parties will negotiate, in good faith, a substitute, valid and enforceable provision which most nearly affects the parties’ intent in relation to the provision that has been held to be illegal, invalid, or unenforceable.",
              "Change of Control: The Merchant acknowledges that the business and assets of Zomato may be sold in the future and consents to the transfer or disclosure of its personal information and these Terms to any purchaser of the business of Zomato or its assets if that outcome occurs.",
              "Acceptance to Zomato’s Privacy Policy: By signing the Form, the Merchant acknowledges and agrees to be bound by Zomato’s privacy policy (https://www.zomato.com/privacy). Merchant will immediately notify Zomato if it becomes aware of or suspects any unauthorized use or access to the user data or any other Confidential Information of Zomato and shall cooperate with Zomato in the investigation of such breach and the mitigation of any damage.",
              "Modification: Zomato may modify these Terms from time to time, and any such changes will (i) be reflected on the Zomato Application, and (ii) be effective immediately upon the changes being reflected on the Zomato Application. The Merchant agrees to be bound to any such changes or modifications and understands and accepts the importance of regularly reviewing these Terms as updated on the Zomato Application. Further, in the event Zomato upgrades, modifies, or replaces Zomato Dining ('Service Modifications'), Zomato will notify the Merchant prior to making the same and give the Merchant the opportunity to review and comment on the Service Modifications before continuing to provide Offer(s) under Zomato Dining or any alternative service offered by Zomato. The Service Modifications will also be reflected on the Zomato Application. If the Merchant continues to provide Offer(s) under Zomato Dining or any alternate service offered by Zomato, following any notice of the Service Modifications, it shall constitute the Merchant’s acceptance of such Service Modifications.",
              "Independent Contractors: The relationship of Zomato and the Merchant is one of independent contractors, and nothing contained in these Terms will be construed to (i) give either party the power to direct and control the day-to-day activities of the other, (ii) constitute the parties as partners, joint ventures, co-owners, or otherwise as participants in a joint or common undertaking, or (iii) allow the Merchant to create or assume any obligation on behalf of Zomato for any purpose whatsoever. All financial obligations associated with the Merchant’s business are the sole responsibility of the Merchant.",
            ],
          },
        ],
      },
    },
    {
      index: "UAE",
      content: "",
      subsections: {
        heading: "UAE Terms and Conditions Zomato Dining MEF",
        subheading: [
          {
            heading: ``,
            info: "These Terms forms an integral part of the Merchant Enrolment Form for Zomato Dining (“Form”) and constitute a legally binding agreement made between you, whether personally or on behalf of an entity (the “Merchant”), Zomato Media Private Limited (Dubai branch) and/or Zomato Media Private Limited (Abu Dhabi Branch), as the case may be (“Zomato”), wherein the Merchant agrees to extend Offer(s) to the Customer (as defined below).",
          },

          {
            heading: "1. DEFINITIONS",
            info: "",
            list: [
              "Bill: The invoice raised for the Bill Value of the Customer by the Restaurant Partner towards the sale of food and beverages at the Restaurant.",
              "Bill Value: The total amount in Dirhams set out in the Bill towards the goods and services availed by the Customer at the Restaurant and shall include applicable taxes, service charge, and other charges as may be applicable.",
              "Commencement Date: The date set out in the Form or any other such date as notified by Zomato via email, whichever is later, from which the Merchant shall extend the Offer(s) to the Customer.",
              "Customer: A user, who pays the Bill Value through the Zomato Application.",
              "Customer Data: Any and all identifiable information about Customer provided by the Customer via the Zomato Application, including, but not limited to, Customer’s name, delivery addresses, email addresses, phone numbers, and Customer preferences, to be governed by the privacy policy located at https://www.zomato.com/policies/privacy.",
              "Commission: The amount payable by the Merchant to Zomato, being a percentage (%) of Net Sales as set out in the Form.",
              "Electronic Payment Mechanism: The online and mobile-based payment mechanisms including third-party payment gateways, credit card/debit card/net banking transfer, and/or e-wallets and/or any loyalty points that are available on the Zomato Application for the purposes of facilitating the payment of Net Sales and Tips (if any) payable by the Customer.",
              "Information: The information set out and provided along with the Form, Zomato Dashboard, and includes any information which is supplied by the Merchant to Zomato under these Terms such as the menu, the price lists underlying the menu, opening hours of the restaurants operated by the Merchant, rates at which taxes are charged by the Merchant to the Customer, specific information the Restaurant Partner is under an obligation to supply to Zomato (a) immediately on the Execution Date; or (b) within one (1) day from any change in such information.",
              "Merchant: The owner/operator of the Restaurant as mentioned in the Form.",
              "Net Sales: The Bill Value payable by a Customer to the Merchant towards the goods and services availed by the Customer at the Restaurant less the Offer(s) offered by the Restaurant.",
              "Offer(s): Shall include, but not be restricted to (i) percentage of discount that the Merchant agrees to extend to the Customers (including a Customer availing Zomato Pro membership), on the Bill Value for each Transaction; or (ii) any other discount(s)/promotional offer(s) as may be agreed between the Parties from time to time.",
              "Order: The placement of an order by the Customer with the Merchant at the Restaurant for food and beverages at the Restaurant directly.",
              "Parties: Zomato and the Merchant.",
              "Restaurant: The establishment(s) for which the Merchant is executing the Form.",
              "Tips: The amount voluntarily paid by Customers to the Restaurant at its sole discretion through the Zomato Application.",
              "Transaction: Each instance where the Customer makes payments towards the Bill Value via the Zomato Application.",
              "Validity Period: From the date the Offer(s) is made available by the Merchant to Customers and during which the Merchant is not permitted to modify the Offer(s).",
              "Weekends: The period starting from Saturday 4:00 am until Monday 4:00 am.",
              "Zomato Application: The mobile application, owned and operated by Zomato.",
              "Zomato Dashboard: The Zomato owned merchant interface platform, the access to which is provided by Zomato to the Merchant.",
              "Zomato Pro: The subscription-based membership program offered to Customers for a prescribed period and for a fee.",
            ],
          },
          {
            heading: "2. MERCHANT COVENANT’S",
            info: "",
            list: [
              "Bill means the invoice raised for the Bill Value of the Customer by the Restaurant Partner towards the sale of food and beverages at the Restaurant.",
              "Bill Value means the total amount in Dirhams set out in the Bill towards the goods and services availed by the Customer at the Restaurant and shall include applicable taxes, service charge and other charges as may be applicable.",
              "Commencement Date means the date set out in the Form or any other such date as notified by Zomato via email, whichever is later, from which the Merchant shall extend the Offer(s) to the Customer.",
              "Customer means a user, who pays the Bill Value through the Zomato Application (as defined below).",
              "Customer Data means any and all identifiable information about Customer provided by the Customer via the Zomato Application, including, but not limited to, Customer’s name, delivery addresses, email addresses, phone numbers, and Customer preferences, to be governed by the privacy policy located at https://www.zomato.com/policies/privacy.",
              "Commission means the amount payable by the Merchant to Zomato, being a percentage (%) of Net Sales as set out in the Form.",
              "Electronic Payment Mechanism means the online and mobile based payment mechanisms including third party payment gateways, credit card/debit card/net banking transfer and/or ewallets and/ or any loyalty points that are available on the Zomato Application for the purposes of facilitating the payment of Net Sales and Tips (if any) payable by the Customer.",
              "Information means the information set out and provided along with the Form, Zomato Dashboard and includes any information which is supplied by the Merchant to Zomato under these Terms such as the menu, the price lists underlying the menu, opening hours of the restaurants operated by the Merchant, rates at which taxes are charged by the Merchant to the Customer, specific information the Restaurant Partner is under an obligation to supply to Zomato immediately on the Execution Date or within one day from any change in such information.",
              "Merchant means the owner/operator of the Restaurant as mentioned in the Form.",
              "Net Sales means the Bill Value payable by a Customer to the Merchant towards the goods and services availed by the Customer at the Restaurant less the Offer(s) offered by the Restaurant.",
              "Offer(s) shall include, but not be restricted to percentage of discount that the Merchant agrees to extend to the Customers (including a Customer availing Zomato Pro membership), on the Bill Value for each Transaction; or any other discount(s)/promotional offer(s) as may be agreed between the Parties from time to time.",
              "Order means the placement of an order by the Customer with the Merchant at the Restaurant for food and beverages at the Restaurant directly.",
              "Parties means Zomato and the Merchant.",
              "Restaurant means the establishment(s) for which the Merchant is executing the Form.",
              "Tips means the amount voluntarily paid by Customers to the Restaurant at its sole discretion through the Zomato Application.",
              "Transaction means each instance where the Customer makes payments towards the Bill Value via the Zomato Application.",
              "Validity Period means from the date the Offer(s) is made available by the Merchant to Customers and during which the Merchant is not permitted to modify the Offer(s).",
              "Weekends means the period starting from Saturday 4:00 am until Monday 4:00 am.",
              "Zomato Application means the mobile application, owned and operated by Zomato.",
              "Zomato Dashboard means the Zomato owned merchant interface platform, the access to which is provided by Zomato to the Merchant.",
              "Zomato Pro means the subscription-based membership program offered to Customers for a prescribed period and for a fee.",
              "The Merchant hereby agrees to extend the Offer(s) to Customer in accordance with the terms set out in the Form and these Terms on and from the Commencement Date.",
              "The Merchant will determine the Offer(s) via the Zomato Dashboard, which will be honoured by the Merchant through the Validity Period.",
              "The Offer(s) once determined by the Merchant, shall be applicable for the minimum Validity Period, during which the Merchant will not be permitted to modify the Offer(s). Any modification to the Offer(s) can only be made by the Merchant after the expiry of the Validity Period and will take two days thereafter to be effective and applied on any Transaction.",
              "The Merchant shall ensure that it has all rights, title, and interest in the content shared by the Merchant with Zomato including but not limited to any artwork(s), creative(s), logo(s), picture(s), video(s), music, and write-up(s), banner(s), image(s) to be displayed on the Zomato Application.",
              "You further agree to grant Zomato and its affiliates a non-exclusive, royalty-free, irrevocable and perpetual right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, upload and display the Content, on the Zomato Application.",
              "The Merchant shall ensure that the Content is compliant with the applicable laws and the content guidelines as set out in these Terms.",
              "The Merchant shall ensure that such Content displayed on the Zomato Application is not unlawful, misleading, fraudulent, illegal, or unauthorized.",
              "The Merchant acknowledges that Zomato shall in no manner be liable for the Content displayed on the Zomato Application, when such Content is provided by the Merchant.",
              "The Merchant hereby agrees and acknowledges that Zomato shall be authorised to use the logo and brand name of the Restaurant or the Merchant as the case may be for the purpose of advertisement of the Offer(s).",
              "In the event the Merchant has an ongoing collaboration with a third party and wishes to promote such collaboration on the Zomato Application, the Merchant shall provide Zomato with a letter from such third party acknowledging the collaboration along with a no-objection letter from such third party in a format acceptable to Zomato.",
              "The Merchant hereby permits Zomato to advertise and extend the Offer(s) to the Customer on behalf of the Restaurant.",
              "The Merchant hereby authorizes Zomato to collect Net Sales and Tips (if any) from the Customer on behalf of the Merchant.",
              "The Merchant shall extend the Offer(s) to all Customers.",
              "The Merchant shall ensure that the Customer makes payment towards the Net Sales, for every Transaction where the Offer is applied, via the Zomato Application or by scanning the QR code at the Restaurant, and not accept any direct payments from the Customer, for availing the Offer.",
              "The Merchant hereby agrees not to extend any discount/offers similar, lower or higher, to the Offer(s) agreed during the Validity Period to the Customer directly.",
              "The Merchant shall not, directly or indirectly discriminate, discourage, solicit or refuse a Customer from availing the Offer(s), from subscribing to Zomato Pro and/or from making payment of the Net Sales via the Zomato Application.",
              "The Merchant hereby agrees that where it levies service charge at its Restaurant, it shall apply the same uniformly to all the Customers availing services of the Restaurant and shall not in any event discriminate in levying the service charge between a Customer availing Zomato Pro and a non-Zomato Pro Customer.",
              "The Merchant permits Zomato to deduct the Commission from the Net Sales and transfer such remaining amounts to the Merchant in accordance with the payment settlement process set out in the Form.",
              "The Merchant will not charge any additional amount, over and above the Net Sales, from the Customer paying the Bill via the Zomato Application.",
              "The Merchant shall ensure that all mandatory information pertaining to taxes, levies and charges applicable on the Bill are clearly visible to the Customers on the Bill as per applicable laws.",
              "The Merchant hereby permits Zomato to contact the Merchant by phone, email, SMS, or other modes of communication, for the purpose of giving feedback or for the purpose of facilitation of any issue in connection with the terms of the Form and these Terms.",
              "The Merchant and its representatives shall honour the Offer(s) requested by a Customer irrespective of the number of people seated on the table. For the purpose of clarity, all individuals seated on the table are not required to be Customers.",
              "The Merchant agrees and acknowledges that Zomato reserves the right to advertise the Offer(s) extended by other restaurants as well, as a part of other services as well, including Zomato Pro program.",
              "The Merchant agrees that the Offer(s) cannot be combined with any other ongoing offers, discounts or deals extended by the Merchant at the Restaurant.",
              "Notwithstanding anything otherwise set out herein, the Merchant shall, at all times remain, solely liable for the goods and/or services, rendered to a Customer at the Restaurant; any in-person interactions with the Customer by the Merchant and or its representatives; payment of all applicable taxes and statutory dues with respect to the goods and services offered and charged by the Restaurant and the Offer(s) extended to the Customer and compliance with all applicable laws; the Customer’s experience at the Restaurant; and in the event the Merchant or its representative do not honor the Offer(s) which a Customer desires to avail, Zomato reserves the right to contact the Customer telephonically or via email and/or SMS or by any other means of communication regarding the Customer’s experience and such response of the Customer shall be communicated by Zomato to the Merchant.",
              "The Merchant hereby represents to Zomato that it is in compliance with all rules and regulations prescribed by extant excise laws and that it has a valid license to sell liquor and/or alcoholic beverages at the Restaurant.",
              "The Merchant will ensure that the Information provided to Zomato is current and accurate, including but not limited to the Merchant name, address, contact telephone number, email, manager/contact person details, delivery times, opening hours, menus, price lists, taxes, service addresses, and other relevant information. Where the Merchant has a unilateral right to access to Zomato Dashboard to edit and update the Information which is displayed on the Zomato Application, the Merchant should ensure that it keeps such information true, accurate and updated at all times and complies with Zomato’s internal terms and conditions of use in this regard.",
              "The Merchant shall provide all Material with respect to the Restaurant to be used for the purpose of promotions on the Zomato Application. Merchant shall ensure that it has all rights, title and interest in the Material it shares with Zomato.",
            ],
          },
          {
            heading: "3. CONTENT GUIDELINES",
            info: "For the purpose of Zomato Dining, the Merchant agrees to not post or transmit any Content that:",
            list: [
              "a. is plagiarized;",
              "b. contains sexually explicit, defamatory or obscene materials or any unlawful materials;",
              "c. contains blurry or unclear photos;",
              "d. contains unpleasant photos that ruin people's experience;",
              "e. contains content, advertisement of which is prohibited by applicable laws;",
              "f. which is harmful, threatening, abusive, harassing, tortious, indecent, defamatory, discriminatory, vulgar, profane, libelous, hateful or otherwise objectionable, invasive of another's privacy, relating or encouraging money laundering or gambling;",
              "g. constitutes an inauthentic or knowingly erroneous review, or does not address the goods and services, atmosphere, or other attributes of the business you are reviewing;",
              "h. violates any third-party right, including, but not limited to, right of privacy, right of publicity, copyright, trademark, patent, trade secret, or any other intellectual property or proprietary rights;",
              "i. accuses others of illegal activity, or describes physical confrontations or attempts to impersonate another person or entity;",
              "j. content which advertises for sale, any item prohibited by law, including potentially hazardous food or tobacco products;",
              "k. alleges any matter related to health code violations requiring healthcare department reporting;",
              "l. is illegal, or violates any central, state, or local law or regulation (for example, by disclosing or trading on inside information in violation of securities law);",
              "m. constitutes a form of deceptive advertisement or causes, or is a result of, a conflict of interest;",
              "n. includes spam, surveys, contests, pyramid schemes, postings or reviews submitted or removed in exchange for payment, postings or reviews submitted or removed by or at the request of the business being reviewed, or other advertising materials;",
              "o. asserts or implies that the Content is in any way sponsored or endorsed by Zomato;",
              "p. falsely states, misrepresents, or conceals your affiliation with another person or entity;",
              "q. distributes computer viruses or other code, files, or programs that interrupt, destroy, or limit the functionality of any computer software or hardware or electronic communications equipment;",
              "r. ‘hacks’ or accesses without permission our proprietary or confidential records, records of another Customer, or those of anyone else;",
              "s. violates any contract or fiduciary relationship (for example, by disclosing proprietary or confidential information of your employer or client in breach of any employment, consulting, or non-disclosure agreement);",
              "t. removes, circumvents, disables, damages or otherwise interferes with security-related features, or features that enforce limitations on use of the Zomato Application;",
              "u. collects, accesses, or stores personal information about other Customers of the Services;",
              "v. posted by a bot;",
              "w. harms minors in any way;",
              "x. threatens the unity, integrity, defense, security or sovereignty of the country of use, friendly relations with foreign states, or public order or causes incitement to the commission of any cognizable offense or prevents investigation of any offense or is insulting any other nation;",
              "y. modifies, copies, scrapes or crawls, displays, publishes, licenses, sells, rents, leases, lends, transfers or otherwise commercialize any rights to the Zomato Application or Zomato’s content; or",
              "z. is patently false and untrue, and is written or published in any form, with the intent to mislead or harass a person, entity or agency for financial gain or to cause any injury to any person.",
            ],
          },
          {
            heading: "4. ZOMATO COVENANT’S",
            info: "",
            list: [
              "a. Zomato will provide Electronic Payment Mechanism to the Customers to make payment towards Net Sales and Tips (if any).",
              "b. Zomato will transfer the Net Sales collected from the Customers, less the Commission and any other amount(s) payable by the Merchant to Zomato under the Form or these Terms, to the Merchant in accordance with terms of the Form read along with the Terms.",
              "c. Zomato will deduct tax collected at source from the Net Sales after adjusting for taxes.",
              "d. Zomato will have the right to remove/suspend advertising the Merchant and the Offer(s) from the Zomato Application at any time at its sole discretion.",
            ],
          },
          {
            heading: "5.COMMISSION",
            info: "",
            list: [
              "a. The Merchant undertakes to pay to Zomato, (i) Commission at the rates set out in the Form and (ii) the Merchant’s share (up to 20%) of any discount(s)/promotional offer(s) that Zomato may extend to the Customers in partnership with banking institutions and/or third parties.",
              "b. The Parties hereby agree that from time to time, Zomato may change the Commission rates or include any additional charges/ fee, provided however, that Zomato shall communicate any such change(s) via email or any other modes of communication to the Merchant with a prior intimation of forty-five (45) days.",
            ],
          },
          {
            heading: "6. Payment Settlement Process",
            info: "",
            list: [
              "The Merchant acknowledges and agrees that any Net Sales and Tips (if any) which is collected by Zomato for, and on behalf of the Merchant in accordance with these Terms, shall be passed on by Zomato to the Merchant subject to the deduction of the below mentioned amounts by Zomato:",
              "Commission and any taxes as applicable thereon;",
              "Payment Gateway Fee;",
              "VAT as applicable;",
              "Any other amounts or charges that are due to Zomato under the Form and/or the Terms.",
              "Notwithstanding anything to the contrary contained in these Terms or the Form, the Merchant, on behalf of itself and all its affiliates, hereby unconditionally and irrevocably authorizes Zomato to set off, withhold and deduct any amounts owed by the Merchant or its affiliates to any Zomato Group Company under any agreement, arrangement or understanding between the Zomato Group Company and the Merchant or its affiliates, from the Net Sales, and apply such amounts towards the dues owed by the Merchant or its affiliates to the Zomato Group Company.",
              "Without prejudice to the other provisions of the Form or these Terms, and solely for the purposes of this Clause 5 (b), the Merchant hereby agrees, acknowledges and confirms that the amounts so set off, withheld and applied in the aforesaid manner shall be deemed to form part of the Commission payable by the Merchant to Zomato under the Form and these Terms.",
              "For purposes of the provisions of this Clause 5 (b), the term Zomato Group Company shall be deemed to include any of Zomato's current and former, direct and indirect, subsidiaries and/or controlled affiliates as well as any successor to Zomato or all or any material portion of the businesses and/or assets of Zomato or any successor thereto or any of its direct and indirect, subsidiaries and/or controlled affiliates.",
              "The Parties acknowledge and agree that after the deduction of the aforementioned amount set out in Clause 6 (a) and 6 (b), Zomato shall remit the Net Sales due to the Merchant as per the Payment Settlement Day set out in the Form.",
              "If the Payment Settlement Day falls on a bank holiday/or a non-business day, the payment shall be processed on the next working day.",
              "The Merchant acknowledges and agrees that Zomato will provide the Merchant with a monthly VAT invoice within a period of 7 (seven) days from the last date of the preceding month for the Commission, Payment Gateway Fee and other amounts, charges that are due and payable by the Merchant to Zomato under the Forms and these Terms.",
              "The Merchant acknowledges and agrees that all amounts that are payable to Zomato under these Terms shall be exclusive of the applicable taxes and that all applicable taxes will be charged separately.",
              "Notwithstanding anything to the contrary herein, the Merchant is, and will be, responsible for all taxes, payments, fees, and any other liabilities associated with the computation, payment, and collection of taxes in connection with the Bill and the Merchant’s use of the Application.",
              "It is clarified that Zomato will not be liable for payment of any taxes that the Merchant is liable to pay in connection with the Goods which shall be provided by the Merchant to the Customers in accordance with these Terms and that the Merchant hereby undertakes to indemnify, defend and hold harmless, Zomato and each of its affiliates and (as applicable) all of their directors, officers, employees, representatives and advisors against any tax liability that may arise against Zomato on account of the non-payment of taxes by the Merchant under these Terms.",
            ],
          },
          {
            heading: "7. TERM AND TERMINATION",
            info: "",
            list: [
              "The arrangement between the parties shall commence from the Commencement Date and shall be valid and binding on the parties, unless terminated in accordance with these Terms.",
              "Either Party may terminate the Form and the Terms by issuing a forty-five (45) days prior written notice of termination to the other Party.",
              "Notwithstanding anything to the contrary contained herein, above, Zomato may forthwith terminate the agreement or suspend the Restaurant if:",
              "The Merchant is in breach of these Terms and/or the terms and conditions of the Form, which, in the case of a capable of remedy, is not remedied within fourteen (14) days after intimation is given to the Merchant specifying the default.",
              "Upon the happening of any of the insolvency events such as bankruptcy, appointment of receiver, administrator, liquidator, winding up, or dissolution;",
              "The Merchant fails to comply with applicable law;",
              "The Merchant hereby agrees and acknowledges that Zomato shall exercise its right to terminate the Form and the Terms in accordance to Clause 6 above and the arrangement shall be deemed to be completed and fulfilled with the Merchant by Zomato without any liability to the Merchant under the Form and these Terms.",
            ],
          },
          {
            heading: "8. LICENSE",
            info: "Merchant hereby grants Zomato an unrestricted, non-exclusive, royalty-free license in respect of all content and information provided to Zomato by the Merchant for the purposes of inclusion on the Zomato Application and as may be otherwise required under the Form. This includes, but is not limited to, a) use of the Merchant’s name in the context of Google ad words to support advertising and promotional campaigns to promote offer(s) on internet which may be undertaken by Zomato b) preparation of derivative works of, or incorporate into other works, all or any portion of the marketing materials which will be made by Zomato for the purposes of its business. Any material including any information and content such as artwork, creative(s), logo(s), picture(s), video(s), music and write-up(s) with respect to the Restaurant to be used for the purpose of promotions on the Zomato Application which the Merchant transmits or submits to Zomato either through the Zomato Application or otherwise (“Material”) shall be considered and may be treated by Zomato as non-confidential, subject to Zomato’s obligations under relevant data protection legislation. The Merchant also grants to Zomato a royalty-free, perpetual, irrevocable, non-exclusive license to use, copy, modify, adapt, translate, publish and distribute world-wide any Material for the purposes of providing services under these Terms or to or for the purposes of advertising and promotion of the Zomato Application. The Merchant agrees that all information provided to Zomato that is published, may be relied upon and viewed by Customers to enable them to make decisions.",
          },
          {
            heading: "9. CONFIDENTIALITY",
            info: "Any confidential or proprietary information of either party, whether of a technical, business or other nature, including, but not limited to consumer information/ Customer Data, trade secrets, know-how, technology and information relating to customers, business plans, promotional and marketing activities, finances and other business affairs, including but not limited to these Terms (collectively, “Confidential Information”) disclosed to the receiving party by the disclosing party, including Confidential Information disclosed before the date of signing the Form, will be treated by the receiving party as confidential and proprietary. These Terms shall be considered Zomato’s Confidential Information. Unless specifically authorized by the disclosing party, the receiving party will: (a) not use such Confidential Information except as authorized by the disclosing party; (b) not disclose such Confidential Information to any third party; and (c) otherwise protect such Confidential Information from unauthorized use and disclosure to the same extent that it protects its own Confidential Information of a similar nature. This section will not apply to any information that: (i) was already known to the receiving party, other than under an obligation of confidentiality, at the time of disclosure by the disclosing party; (ii) was generally available to the public or otherwise part of the public domain at the time of its disclosure to the receiving party; (iii) became generally available to the public or otherwise part of the public domain after its disclosure and other than through any act or omission of the receiving party in breach of these Terms; (iv) was disclosed to the receiving party, other than under an obligation of confidentiality, by a third party who had no obligation to the other party not to disclose such information to others; or (v) was developed independently by the receiving party without any use of Confidential Information.",
          },
          {
            heading: "10. WARRANTY AND INDEMNITY",
            info: "",
            list: [
              "Merchant warrants that if the Merchant ceases to do business, closes operations for a material term, then the Merchant shall provide Zomato a prior thirty (30) days written notice, failing which the Merchant shall indemnify Zomato for any claims or dispute that may arise on account of the aforementioned acts of the Merchant.",
              "The Merchant hereby unconditionally represents to Zomato that it shall at all times be in compliance with the conditions imposed upon it by any license issued by any rule/regulation/statute.",
              "Merchant will ensure that it complies with and remains in compliance with all applicable laws and all other applicable legislation, regulations or standards.",
              "The Merchant agrees to indemnify and hold Zomato harmless (and its directors, officers, agents, representatives, and employees) from and against any and all claims, suits, liabilities, judgments, losses and damages arising out of or in connection with any claim or suit or demand:",
              "on account of breach of these Terms by the Merchant;",
              "in respect of, arising out of, or in connection with the Offer(s) extended by the Merchant;",
              "the quality of the food and beverages offered by the Merchant;",
              "the Material shared by the Merchant with Zomato and/or on the Zomato Application;",
              "any statutory proceedings which may arise out of any acts of omission or commission by the Merchant in relation to the applicable excise laws;",
              "on account of any non-compliance of a condition under the license issued by any rule/regulation/statute.",
              "Zomato warrants that it will undertake its obligations with reasonable skill and care. Zomato does not guarantee or warrant that the Zomato Application will be free from defects or malfunctions. If errors occur, it will use its best endeavors to resolve these as quickly as possible.",
            ],
          },
          {
            heading: "11. CUSTOMER DATA",
            info: "The Merchant agrees that the Merchant will only use the Customer Data in fulfilling and in complying with the Merchant's obligations in these Terms, and the Merchant agrees that Customer Data will not be used to enhance any file or list of the Merchant or any third party. The Merchant represents, warrants, and covenants that it will not resell, broker or otherwise disclose any Customer Data to any third party, in whole or in part, for any purpose whatsoever. The Merchant agrees that it will not copy or otherwise reproduce any Customer Data other than for the purpose of fulfilling its obligations under this Form and Terms. The Merchant (and any other persons to whom the Merchant provides any Customer Data) will implement and comply with reasonable security measures in protecting, handling, and securing the Customer Data. If any Customer Data is collected by the Merchant (or otherwise on its behalf), the Merchant shall ensure that it (and any applicable third parties) adopt, post, and process the Customer Data in conformity with an appropriate and customary privacy policy. For purposes of these Terms, the restrictions set forth herein on the Merchant's use of Customer Data do not apply to: (a) data from any customer who was a customer of Merchant prior to the Merchant using the Zomato Application, but only with respect to data that was so previously provided to the Merchant by such Customer; or (b) data supplied by a customer directly to the Merchant who becomes a customer of the Merchant and who explicitly opts in to receive communications from the Merchant for the purposes for which such Customer Data will be used by Merchant; and, provided in all cases, that the Merchant handles and uses such Customer Data in compliance with applicable Laws and the Merchant's posted privacy policy.",
          },
          {
            heading: "12. LIMITATION OF LIABILITY",
            info: "For the purposes of this Section, Liability means liability in or for breach of contract, negligence, misrepresentation, tortious claim, restitution or any other cause of action whatsoever relating to or arising under or in connection with these Terms and the Form, including liability expressly provided for under these Terms and the Form or arising by reason of the invalidity or unenforceability of any these Terms or the terms of the Form. Zomato does not exclude or limit Liability for any Liability that cannot be excluded by law. Subject to the preceding sentence, Zomato shall not be under any Liability for loss of actual or anticipated profits, loss of goodwill, loss of business, loss of revenue or of the use of money, loss of contracts, loss of anticipated savings, loss of data and/or undertaking the restoration of data, any special, indirect or consequential loss, and such liability is excluded whether it is foreseeable, known, foreseen or otherwise. For the avoidance of any doubt, this Section shall apply whether such damage or loss is direct, indirect, consequential or otherwise. Although Zomato will use its best endeavours to ensure that the unintentional operational errors do not occur, Zomato cannot provide any warranty or guarantee in this regard. Notwithstanding anything to the contrary herein set out, Zomato’s aggregate liability under these Terms and the Form shall not exceed the Bill Value under which the claim arose.",
          },
          {
            heading: "13. NOTICES",
            info: "All notices, demands or consents required or permitted under these Terms shall be provided (i) by email or (ii) in writing and personally delivered or sent by telecopy, telegram or registered or certified mail, return receipt requested, or by a reputable overnight carrier to the address designated by the other party and will be deemed to have been served when delivered, or if delivery is not accomplished by some fault of the addressee, when tendered. If, to Zomato, such papers must be sent to legal@zomato.com to the attention of the Legal Department. The communications between the Merchant and Zomato may employ electronic means, such as email or notifications provided by Zomato to the Merchant. The Merchant agrees (i) to receive communications from Zomato in an electronic form, and (ii) agrees that all terms and conditions, agreements, notices, disclosures, and other communications that Zomato provides electronically satisfy any legal requirement that such communications would satisfy if they were in writing.",
          },
          {
            heading: "14. FORCE MAJEURE",
            info: "Neither party will be liable to the other party for any failure or delay in performance caused by reasons beyond its reasonable control, including but not limited to acts of God, epidemics, earthquakes, strikes, lockdowns, civil disturbances, or similar causes.",
          },
          {
            heading: "15. GOVERNING LAW AND DISPUTE RESOLUTION",
            info: "These Terms shall be governed by the Laws of UAE, for the time being in force and the courts of Dubai shall have the exclusive jurisdiction to preside over matters arising hereunder.",
          },
          {
            heading: "16. General",
            info: "",
            list: [
              "Assignment: These Terms shall not be assigned by the Merchant without the prior written consent of Zomato. Any purported transfer, assignment, or delegation without such prior written consent shall be null and void. Zomato may assign or transfer these Terms for any reason to any person. Subject to the foregoing, these Terms shall bind and inure to the benefit of each party’s successors and permitted assigns.",
              "Partial Invalidity: If any provision in these Terms is or becomes illegal, invalid, or unenforceable in any respect under applicable law, neither the legality, validity, nor the enforceability of the remaining provisions will in any way be affected or impaired. Further, the parties will negotiate, in good faith, a substitute, valid, and enforceable provision which most nearly affects the parties’ intent in relation to the provision that has been held to be illegal, invalid, or unenforceable.",
              "Change of Control: The Merchant acknowledges that the business and assets of Zomato may be sold in the future and consents to the transfer or disclosure of its personal information and these Terms to any purchaser of the business of Zomato or its assets if that outcome occurs.",
              "Acceptance to Zomato’s Privacy Policy: By signing the Form, the Merchant acknowledges and agrees to be bound by Zomato’s privacy policy (https://www.zomato.com/privacy). Merchant will immediately notify Zomato if it becomes aware of or suspects any unauthorized use or access to the user data or any other Confidential Information of Zomato, and shall cooperate with Zomato in the investigation of such breach and the mitigation of any damage.",
              "Except as expressly set out herein, the Parties hereby agree that the Form and Terms supersede and replace any and all previous agreements/forms between the Merchant and Zomato.",
              "Modification: Zomato may modify these Terms from time to time, and any such changes will (i) be reflected on the Zomato Application, and (ii) be effective immediately upon the changes being reflected on the Zomato Application. The Merchant agrees to be bound to any such changes or modifications and understands and accepts the importance of regularly reviewing these Terms as updated on the Zomato Application. Further, in the event Zomato upgrades, modifies, or replaces Zomato Dining (“Service Modifications”), Zomato will notify the Merchant prior to making the same and give the Merchant the opportunity to review and comment on the Service Modifications before continuing to provide Offer(s) under Zomato Dining or any alternative service offered by Zomato. The Service Modifications will also be reflected on the Zomato Application. If the Merchant continues to provide Offer(s) under Zomato Dining or any alternate service offered by Zomato, following any notice of the Service Modifications, it shall constitute the Merchant’s acceptance of such Service Modifications.",
              "Independent Contractors: The relationship of Zomato and the Merchant is one of independent contractors, and nothing contained in these Terms will be construed to (i) give either party the power to direct and control the day-to-day activities of the other, (ii) constitute the parties as partners, joint ventures, co-owners, or otherwise as participants in a joint or common undertaking, or (iii) allow the Merchant to create or assume any obligation on behalf of Zomato for any purpose whatsoever. All financial obligations associated with Merchant’s business are the sole responsibility of the Merchant.",
            ],
          },
        ],
      },
    },
  ];
  const contentAward = [
    {
      index: "India",
      content: "",
      subsections: {
        heading: "Zomato Restaurant Awards 2023 Attendee Terms and Conditions",
        subheading: [
          {
            heading: "Zomato Restaurant Awards 2023 Terms and Conditions;",
            info: "",
            list: [
              '"Invitee(s)" means the representative(s) invited by Zomato Limited ("Zomato") for the Restaurant Awards 2023 ("Event") at the venue where the Event is scheduled to be organised ("Venue").',
              "Invitee(s) agree that they are attending the Event upon receiving a legitimate invitation from Zomato at their own discretion and will.",
              "Invitee(s) understands that the invitations issued by Zomato are non-transferable in nature. Only the Invitee(s) in whose name the invitation is issued, will be allowed to enter the Venue.",
              "Consumption of alcoholic beverages at the Event is only permitted to Invitee(s) who are of legal drinking age as per the respective State guidelines.",
              "Invitee(s) shall be responsible for their property or belongings. Zomato and/or the Venue does not take any responsibility for the loss or damage to any such property or belongings of the Invitee(s).",
              "Zomato shall not be responsible for any injury or damage caused to any Invitee(s) at the Event.",
              "Invitee(s) may be subject to photography and recording during the Event. By attending the Event, Invitee(s) consent to being photographed and/or recorded for promotional or commercial purposes.",
              "Invitee(s) shall adhere to the respective COVID-19 guidelines issued by the State and Central government.",
              "This is a non-smoking Event. Vape pens, e-cigarettes, any other smoking devices, cigarettes and lighters etc., are prohibited and would not be allowed at the Event.",
              "Outside eatables, beverages, bottles, cans, illegal and banned substances, hazardous substances, or dangerous objects including but not limited to arms and ammunition, lighters, match boxes, aerosols and other flammable items, are not allowed inside the Venue. Zomato or the Venue reserves the right to confiscate these prohibited items and evict the Invitee(s) from the Venue if the Invitee(s) are found to be in possession of such prohibited items. Consumption and sale of illegal and banned substances by anyone at the Venue is strictly prohibited and if the Invitee(s) are found consuming, selling, or possessing such illegal substances, they will be immediately handed over to the appropriate authorities.",
              "Invitee(s) shall be responsible for any physical, reputational, and/or any other damages arising due to any actions and/or conduct of the Invitee(s).",
              "These Terms shall be governed by the laws of India and subject to the Terms, the courts of New Delhi shall have exclusive jurisdiction to determine any disputes arising out of, under, or in relation, to the provisions of these Terms.",
            ],
          },
        ],
      },
    },
  ];

  const [expandedTab, setExpandedTab] = useState(null);
  const [expandedSubTitle, setExpandedSubTitle] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(
    "Guidelines and Policies"
  );
  const [select, setSelect] = useState("General");
  const [mainContent, setMainContent] = useState([]);
  useEffect(() => {
    if (select === "General") {
      const con = content.filter((item) => item.index === selectedContent);
      console.log(con);
      setMainContent(con);
    } else if (select === "Online Ordering") {
      setMainContent(contentOnline);
    } else if (select === "Zomato Dining") {
      const con = contentDining.filter(
        (item) => item.index === selectedContent
      );
      console.log(con);
      setMainContent(con);
    }
  }, [selectedContent]);

  const handleForm = () => {
    navigate("/");
  };
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    // <div className="min-h-screen bg-white text-black font-sans">
    //   {/* Navbar */}
    //   <header className="flex items-center justify-between bg-white text-black h-20 px-8 shadow-sm">
    //     <h1 className="font-[Brush_Script_MT] text-4xl cursor-pointer" onClick={()=>handleForm()}>Zomato</h1>
    //     <nav>
    //   <ul className="flex gap-10 text-xl font-semibold select-none cursor-pointer">
    //     {["General", "Online Ordering", "Zomato Dining", "Zomato Awards"].map((item) => (
    //       <li
    //         key={item}
    //         onClick={() => setSelect(item)}
    //         className={select === item ? "text-red-500" : ""}
    //       >
    //         {item}
    //       </li>
    //     ))}
    //   </ul>
    // </nav>
    //     <button className="bg-white text-black font-semibold px-5 py-2 rounded cursor-pointer hover:bg-gray-200 transition">
    //       Language
    //     </button>
    //   </header>

    //   {/* Main content area */}
    //   {select==="General" && <Content mainContent={mainContent} sideTabs={sideTabs} select={select} setSelect={setSelect} selectedContent={selectedContent} setSelectedContent={setSelectedContent}/>}
    //   {select==="Online Ordering" && <Content mainContent={mainContent} sideTabs={sideTabsOnline} select={select} setSelect={setSelect} selectedContent={selectedContent} setSelectedContent={setSelectedContent}/>}
    //   {select==="Zomato Dining" && <Content mainContent={mainContent} sideTabs={sideTabsDining} select={select} setSelect={setSelect} selectedContent={selectedContent} setSelectedContent={setSelectedContent}/>}
    //   {select==="Zomato Awards" && <Content mainContent={contentAward} sideTabs={sideTabsOnline} select={select} setSelect={setSelect} selectedContent={selectedContent} setSelectedContent={setSelectedContent}/>}
    // </div>

    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      {/* Navbar */}
      <header className="flex items-center justify-between bg-white dark:bg-gray-800 h-16 sm:h-20 px-4 sm:px-6 md:px-8 shadow-sm">
        <h1
          className="font-[Brush_Script_MT] text-black text-2xl sm:text-3xl md:text-4xl cursor-pointer"
          onClick={() => handleForm()}
        >
          Zomato
        </h1>

        {/* Mobile Hamburger Menu */}
        <button
          className="md:hidden text-black dark:text-gray-300"
          onClick={toggleNav}
          aria-label="Toggle navigation"
        >
          {isNavOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Menu */}
        <nav
          className={`${
            isNavOpen ? "block" : "hidden"
          } md:block absolute md:static top-16 left-0 w-full md:w-auto bg-white dark:bg-gray-800 md:bg-transparent dark:md:bg-transparent shadow-md md:shadow-none z-10`}
        >
          <ul className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-10 p-4 md:p-0 text-base sm:text-lg md:text-xl font-semibold select-none">
            {[
              "General",
              "Online Ordering",
              "Zomato Dining",
              "Zomato Awards",
            ].map((item) => (
              <li
                key={item}
                onClick={() => {
                  setSelect(item);
                  setIsNavOpen(false);
                }}
                className={`cursor-pointer text-black hover:text-red-500 dark:hover:text-red-400 ${
                  select === item ? "text-red-500 dark:text-red-400" : ""
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>

        {/* Language Button */}
        <button className="hidden md:block bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          Language
        </button>
      </header>

      {/* Main content area */}
      <main className="px-4 sm:px-6 md:px-8">
        {select === "General" && (
          <Content
            mainContent={mainContent}
            sideTabs={sideTabs}
            select={select}
            setSelect={setSelect}
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
          />
        )}
        {select === "Online Ordering" && (
          <Content
            mainContent={mainContent}
            sideTabs={sideTabsOnline}
            select={select}
            setSelect={setSelect}
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
          />
        )}
        {select === "Zomato Dining" && (
          <Content
            mainContent={mainContent}
            sideTabs={sideTabsDining}
            select={select}
            setSelect={setSelect}
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
          />
        )}
        {select === "Zomato Awards" && (
          <Content
            mainContent={contentAward}
            sideTabs={sideTabsOnline}
            select={select}
            setSelect={setSelect}
            selectedContent={selectedContent}
            setSelectedContent={setSelectedContent}
          />
        )}
      </main>
    </div>
  );
};

export default Privacy;
