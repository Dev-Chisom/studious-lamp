<template>
	<div class="min-h-screen max-w-6xl mx-auto bg-gray-50 dark:bg-gray-800">
		<div>
			<Head>
				<Title> {{ `${user?.displayName || 'User'} (@${username || 'username'}) - Whispers` }} </Title>
			</Head>

			<!-- Cover image -->

			<div class="h-64 bg-gray-200 relative">
				<img v-if="user?.coverImage" :src="user?.coverImage" alt="Cover" class="w-full h-full object-cover" />
				<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
			</div>

			<!-- Profile header -->

			<div class="relative -mt-24 mb-8">
				<div class="max-w-7xl mx-auto">
					<div class="sm:flex sm:items-end sm:space-x-5 px-6">
						<div class="flex">
							<div class="avatar h-32 w-32 ring-4 ring-white">
								<img
									v-if="user?.profileImage"
									:src="user?.profileImage"
									alt="Profile"
									class="h-full w-full object-cover"
								/>

								<div
									v-else
									class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-4xl font-medium dark:bg-primary-900 dark:text-primary-200"
								>
									{{ userInitials || '??' }}
								</div>
							</div>
						</div>

						<div class="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
							<div class="sm:hidden md:block mt-6 min-w-0 flex-1">
								<h1 class="text-2xl font-bold text-gray-800 mt-2 dark:text-gray-100 truncate">
									{{ user?.displayName || 'Unknown User' }}
								</h1>

								<p class="text-gray-500 dark:text-gray-400">@{{ username || 'unknown' }}</p>
							</div>

							<div class="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
								<button v-if="isCurrentUser" class="btn-primary" @click="followUser">
									<Icon :name="isFollowing ? 'lucide:user-minus' : 'lucide:user-plus'" class="h-5 w-5 mr-2" />
									{{ isFollowing ? 'Unfollow' : 'Follow' }}
								</button>
								<button v-else class="btn-outline" @click="navigateTo('/settings')">
									<Icon name="lucide:settings" class="h-5 w-5 mr-2" /> Edit Profile
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Profile content -->

			<div class="max-w-7xl mx-auto">
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<!-- Sidebar -->

					<div class="lg:col-span-1">
						<div class="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6">
							<div class="space-y-6">
								<!-- Bio -->

								<div>
									<h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">About</h2>

									<div class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ user?.bio || 'No bio yet.' }}</div>
								</div>

								<!-- Stats -->

								<div class="border-t border-gray-200 pt-6">
									<dl class="grid grid-cols-2 gap-4">
										<div>
											<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Posts</dt>

											<dd class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
												{{ user?.stats?.posts || 0 }}
											</dd>
										</div>

										<div>
											<dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Followers</dt>

											<dd class="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
												{{ user?.stats?.followers || 0 }}
											</dd>
										</div>
									</dl>
								</div>

								<!-- Social links -->

								<div class="border-t border-gray-200 pt-6">
									<h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">Social</h2>

									<div class="mt-4 space-y-3">
										<a
											v-for="social in user?.social || []"
											:key="social.platform"
											:href="social.url"
											target="_blank"
											rel="noopener noreferrer"
											class="flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
										>
											<Icon :name="`lucide:${social.icon}`" class="h-5 w-5 mr-2" />
											<span class="text-sm">{{ social.handle }}</span>
										</a>
									</div>
								</div>

								<!-- Joined date -->

								<div class="border-t border-gray-200 pt-6">
									<div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
										<Icon name="lucide:calendar" class="h-5 w-5 mr-2" /> Joined
										{{ formatDate(user?.joinedAt) || 'Unknown date' }}
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Main content -->

					<div class="lg:col-span-2 space-y-6">
						<!-- Create post -->

						<div v-if="isCurrentUser" class="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6">
							<div class="flex space-x-3">
								<div class="avatar h-10 w-10">
									<img
										v-if="user?.profileImage"
										:src="user?.profileImage"
										alt="Profile"
										class="h-full w-full object-cover"
									/>

									<div
										v-else
										class="h-full w-full flex items-center justify-center bg-primary-100 text-primary-600 text-lg font-medium dark:bg-primary-900 dark:text-primary-200"
									>
										{{ userInitials || '??' }}
									</div>
								</div>

								<div class="min-w-0 flex-1">
									<textarea
										v-model="newPost"
										rows="3"
										class="form-input"
										placeholder="Share something with your followers..."
									/>

									<div class="mt-3 flex items-center justify-between">
										<div class="flex items-center space-x-2">
											<button class="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-200">
												<Icon name="lucide:image" class="h-5 w-5" />
											</button>
											<button class="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-200">
												<Icon name="lucide:video" class="h-5 w-5" />
											</button>
											<button class="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-200">
												<Icon name="lucide:link" class="h-5 w-5" />
											</button>
										</div>
										<button class="btn-primary" :disabled="!newPost.trim()" @click="createPost">Post</button>
									</div>
								</div>
							</div>
						</div>

						<!-- Posts -->

						<div v-if="posts.length > 0" class="space-y-6">
							<post-card
								v-for="post in posts"
								:key="post.id"
								:post="{
									id: post.id,
									creator: {
										name: user?.displayName || 'Unknown User',
										avatar:
											user?.profileImage ||
											`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'Unknown User')}&background=random`,
									},
									content: post.content,
									image: post.media,
									video: post.video,
									createdAt: post.createdAt,
									likes: post.likes || 0,
									isPremium: post.isPremium || false,
									comments: post.comments.map((comment) => ({
										id: comment.id,
										user: {
											name: comment.user?.name || 'Anonymous',
											avatar:
												comment.user?.avatar ||
												`https://ui-avatars.com/api/?name=${encodeURIComponent(comment?.user?.name || 'Anonymous')}&background=random`,
										},
										content: comment.content,
										createdAt: comment.createdAt,
									})),
								}"
								:is-subscribed="isSubscribed"
								@subscribe="handleSubscribe"
								@tip="handleTip"
							/>
						</div>

						<div v-else class="text-center py-12">
							<p class="text-gray-500 dark:text-gray-400">No posts yet.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../store/user';
import PostCard from '~/components/PostCard.vue';
import { useI18n } from 'vue-i18n';

interface SocialLink {
	platform: string
	icon: string
	handle: string
	url: string
}

interface UserStats {
	posts: number
	followers: number
}

interface UserProfile {
	displayName: string
	username: string
	profileImage: string | null
	coverImage: string | null
	bio: string
	stats: UserStats
	social: SocialLink[]
	joinedAt: Date
}

interface CommentUser {
	name: string
	avatar: string
}

interface PostComment {
	id: string
	user: CommentUser
	content: string
	createdAt: Date
}

interface UserPost {
	id: string
	content: string
	media: string | null
	video: string | null
	createdAt: Date
	likes: number
	isPremium: boolean
	comments: PostComment[]
}

const route = useRoute();
const username = computed<string>(() => route.params.username as string);
const userStore = useUserStore();
const { t } = useI18n();

definePageMeta({
	layout: 'creator',
});

const user = ref<UserProfile>({
	displayName: 'John Doe',
	username: username.value || 'johndoe',
	profileImage: null,
	coverImage: null,
	bio: 'Digital creator and content enthusiast',
	stats: {
		posts: 42,
		followers: 1234,
	},
	social: [
		{
			platform: 'twitter',
			icon: 'twitter',
			handle: '@johndoe',
			url: 'https://twitter.com/johndoe',
		},
		{
			platform: 'instagram',
			icon: 'instagram',
			handle: '@johndoe',
			url: 'https://instagram.com/johndoe',
		},
	],
	joinedAt: new Date('2023-01-01'),
});

const posts = ref<UserPost[]>([
	{
		id: '1',
		content: 'Just posted a new video! Check it out!',
		media: 'https://picsum.photos/800/450',
		video: null,
		createdAt: new Date(),
		likes: 42,
		isPremium: false,
		comments: [
			{
				id: '1',
				user: {
					name: 'Jane Smith',
					avatar: 'https://i.pravatar.cc/150?img=1',
				},
				content: 'Great content!',
				createdAt: new Date(),
			},
		],
	},
	{
		id: '2',
		content: 'Premium content coming soon!',
		media: 'https://picsum.photos/800/451',
		video: null,
		createdAt: new Date(Date.now() - 86400000),
		likes: 15,
		isPremium: true,
		comments: [],
	},
]);

const newPost = ref<string>('');
const isFollowing = ref<boolean>(false);
const isSubscribed = ref<boolean>(false);

const isCurrentUser = computed<boolean>(() => {
	return userStore?.profile?.username === username.value;
});

const userInitials = computed<string>(() => {
	const name = user.value?.displayName || 'User';
	if (!name) {
		return '?';
	}
	const parts = name.split(' ');
	if (parts.length > 1) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}
	return name.substring(0, 2).toUpperCase();
});

const formatDate = (date: Date | string | undefined): string => {
	if (!date) {
		return '';
	}
	return new Intl.DateTimeFormat('en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(new Date(date));
};

const followUser = () => {
	isFollowing.value = !isFollowing.value;
};

const createPost = () => {
	if (!newPost.value.trim()) {
		return;
	}
	newPost.value = '';
};

const handleSubscribe = () => {
	isSubscribed.value = true;
};

const handleTip = () => {
	// Implement tip logic
};

onMounted(() => {
	// Implement API calls to fetch user data and posts
});
</script>
