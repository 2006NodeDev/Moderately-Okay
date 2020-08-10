//set up pub sub topics
import {PubSub} from '@google-cloud/pubsub'

const pubSubClient = new PubSub()

export const userTopic = pubSubClient.topic('projects/tattooshop-284315/topics/console-tattoo')
