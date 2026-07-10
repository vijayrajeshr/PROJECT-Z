import css from './FrequentlyAskedQues.module.css';
import CollapsableCard2 from '../../../utils/Cards/CollapsableCard2/CollapsableCard2'

let FrequentlyAskedQues = () => {
    return <div className={css.outerDiv}>
        <div className={css.innerDiv}>
            <div className={css.title}>Frequently asked questions</div>
            <div className={css.cards}>
            <CollapsableCard2 title="How can I create a restaurant page on Zomato?" content="Creating a restaurant page on Zomato is free of cost. You can maintain your page by replying to reviews and do a lot more without any charges." />
            <CollapsableCard2 title="What benefits will I get by listing my restaurant on Zomato?" content="By listing your restaurant on Zomato, you can increase visibility, reach a larger audience, and attract more customers." />
            <CollapsableCard2 title="How can I update my restaurant's information on Zomato?" content="You can easily update your restaurant's information, such as contact details, menu, and hours, from your Zomato business account." />
            <CollapsableCard2 title="Does Zomato charge for online ordering features?" content="Zomato offers online ordering services with minimal charges. You can manage and track orders through Zomato's platform and apps." />

            </div>
        </div>
    </div>
}

export default FrequentlyAskedQues;