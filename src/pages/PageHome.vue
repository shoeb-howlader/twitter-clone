<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-sm">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newTweetContent"
            placeholder="What's happening?"
            counter
            autogrow
            class="new-tweet"
            maxlength="280"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar1.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            unelevated
            rounded
            color="primary"
            no-caps
            :disable="!newTweetContent"
            class="q-mb-lg"
            label="Tweet"
            @click="addNewTweet"
          />
        </div>
      </div>
      <q-separator size="10px" color="grey-2" class="divider" />
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item class="q-py-md" v-for="tweet in tweets" :key="tweet.id">
            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar1.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Shoeb Howlader</strong>
                <span class="text-grey-7"
                  >@shoeb-howlader <br class="lt-md" />&bull;
                  {{ relativeDate(tweet.date) }}
                </span>
              </q-item-label>
              <q-item-label class="tweet-content text-body1">
                {{ tweet.content }}
              </q-item-label>
              <div class="row justify-between q-mt-sm tweet-icons">
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                />
                <q-btn
                  @click="toggleLiked(tweet)"
                  flat
                  round
                  :color="tweet.liked ? 'pink' : 'grey'"
                  :icon="tweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                />
                <q-btn
                  @click="deleteTweet(tweet)"
                  flat
                  round
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { formatDistance } from "date-fns";
import db from "src/boot/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
export default defineComponent({
  name: "PageHome",
  data() {
    return {
      newTweetContent: "",
      tweets: [
        /*{
          id: "idqwerty",
          content: "test data",
          date: 1640446576579,
          liked: true,
        },
        {
          id: "idqwertywjej",
          content: "test data",
          date: 1640446576579,
          liked: false,
        },*/
      ],
    };
  },
  mounted() {
    const q = query(collection(db, "tweets"), orderBy("date"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let tweetChange = change.doc.data();
        tweetChange.id = change.doc.id;
        if (change.type === "added") {
          console.log("New tweet: ", tweetChange);
          this.tweets.unshift(tweetChange);
        }
        if (change.type === "modified") {
          console.log("Modified tweet: ", tweetChange);
          let index = this.tweets.findIndex(
            (tweet) => tweet.id === tweetChange.id
          );
          Object.assign(this.tweets[index], tweetChange);
        }
        if (change.type === "removed") {
          console.log("Removed tweet: ", tweetChange);
          let index = this.tweets.findIndex(
            (tweet) => tweet.id === tweetChange.id
          );
          this.tweets.splice(index, 1);
        }
      });
    });
  },
  methods: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
    async addNewTweet() {
      let newTweet = {
        content: this.newTweetContent,
        date: Date.now(),
        liked: false,
      };
      //this.tweets.unshift(newTweet);
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "tweets"), newTweet);
      console.log("Document written with ID: ", docRef.id);
      this.newTweetContent = "";
    },
    async deleteTweet(tweet) {
      await deleteDoc(doc(db, "tweets", tweet.id));
    },
    async toggleLiked(tweet) {
      //console.log("liked clicked");
      //console.log(tweet);
      await updateDoc(doc(db, "tweets", tweet.id), {
        liked: !tweet.liked,
      });
    },
  },
});
</script >
<style lang="sass">
.new-tweet
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.tweet-content
  white-space: pre-line
.tweet-icons
  margin-left: -5px
</style>
