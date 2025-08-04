'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, Folder } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import MediaGalleryHeader from './media-gallery-header'
import MediaTabs from './media-tabs'
import MediaLibraryTab from './media-library-tab'
import DeviceUploadTab from './device-upload-tab'
import MediaGalleryFooter from './media-gallery-footer'
import MediaPreviewModal from './media-preview-modal'
import { creatorApi } from '@/lib/creator/creator-api'

interface MediaItem {
	id: string
	url: string
	name: string
	type: 'image' | 'video'
	size?: number
	duration?: number
	file?: File
	thumbnailUrl?: string
	tempId?: string
}

interface MediaGalleryProps {
	isOpen: boolean
	onClose: () => void
	onSelect: (files: MediaItem[]) => void
	onUploadComplete: (results: MediaItem[]) => void
}

const MAX_FILES = 10

export default function MediaGallery({ isOpen, onClose, onSelect, onUploadComplete }: MediaGalleryProps) {
	const { t } = useTranslation()

	// Tab configuration
	const tabs = [
		{ key: 'device', label: 'Upload New', icon: <Upload className="w-5 h-5" /> },
		{ key: 'library', label: 'Media Library', icon: <Folder className="w-5 h-5" /> },
	]

	// State management
	const [activeTab, setActiveTab] = useState<'library' | 'device'>('device')
	const [activeMediaTab, setActiveMediaTab] = useState<'images' | 'videos' | 'all'>('images')
	const [loading, setLoading] = useState(false)
	const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([])
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [selectedFiles, setSelectedFiles] = useState<MediaItem[]>([])
	const [searchQuery, setSearchQuery] = useState('')

	// Preview modal state
	const [showPreviewModal, setShowPreviewModal] = useState(false)
	const [previewFiles, setPreviewFiles] = useState<File[]>([])
	const [previewCurrentIndex, setPreviewCurrentIndex] = useState(0)
	const [isUploading, setIsUploading] = useState(false)
	const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0 })

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1)
	const [perPage, setPerPage] = useState(12)
	const [totalItems, setTotalItems] = useState(0)
	const [totalPages, setTotalPages] = useState(1)

	// Fetch media files from API
	const fetchMediaFiles = async () => {
		setLoading(true)
		try {
			const params: any = {
				page: currentPage.toString(),
				limit: perPage.toString(),
				search: searchQuery,
			}

			if (activeMediaTab === 'images') {
				params.type = 'image'
			} else if (activeMediaTab === 'videos') {
				params.type = 'video'
			}

			const response = await creatorApi.getMediaFiles(params)

			const mediaFiles = (response.data.mediaFiles || []).map((file: any) => ({
				id: file._id,
				url: file.url,
				thumbnailUrl: file.type === 'video' ? file.coverUrl : file.thumbnailUrl || file.url,
				name: file.url.split('/').pop() || 'media',
				type: file.type,
				size: file.size,
				duration: file.duration,
			}))

			setMediaFiles(mediaFiles)
			setTotalItems(response.data.pagination?.total || 0)
			setTotalPages(response.data.pagination?.pages || 1)
		} catch (error) {
			console.log(error, 'error')
			toast.error(t('notifications.contentLoadFailed') || 'Failed to load media files')
			setMediaFiles([])
		} finally {
			setLoading(false)
		}
	}

	// Process file uploads
	const processUploads = async (mediaData: any[]) => {
		const filesPayload = mediaData.map((file) => {
			const payload: any = {
				uuid:
					file.uuid ||
					(typeof crypto !== 'undefined' && crypto.randomUUID
						? crypto.randomUUID()
						: Math.random().toString(36).substring(2, 15)),
				fileName: file.name,
				fileType: file.type === 'video' ? 'video' : 'image',
				size: file.size,
			}

			if (file.type === 'video' && file.coverFile) {
				payload.coverName = file.coverFile.name
			}

			return payload
		})

		const response = await creatorApi.uploadMediaFile({ files: filesPayload })
		const uploadResults = []

		for (let i = 0; i < response.data.length; i++) {
			const { uploadUrl, fileKey, mediaFileId, coverUploadUrl } = response.data[i]
			const fileObj = mediaData[i].file

			// Upload main file
			await fetch(uploadUrl, {
				method: 'PUT',
				body: fileObj,
				headers: {
					'Content-Type': fileObj.type,
				},
			})

			// Upload cover if exists
			if (coverUploadUrl && mediaData[i].coverFile) {
				await fetch(coverUploadUrl, {
					method: 'PUT',
					body: mediaData[i].coverFile,
					headers: {
						'Content-Type': mediaData[i].coverFile.type,
					},
				})
			}

			uploadResults.push({
				...response.data[i],
				fileKey,
				mediaFileId,
			})
		}

		return uploadResults
	}

	// Base64 to File conversion utility
	const base64ToFile = (base64: string, filename: string, mimeType?: string) => {
		const arr = base64.split(',')
		const match = arr[0].match(/:(.*?);/)
		const mime = mimeType || (match ? match[1] : '')
		const bstr = atob(arr[1])
		let n = bstr.length
		const u8arr = new Uint8Array(n)
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n)
		}
		return new File([u8arr], filename, { type: mime })
	}

	// Effects
	useEffect(() => {
		if (isOpen) {
			fetchMediaFiles()
		}
	}, [isOpen])

	useEffect(() => {
		if (isOpen) {
			setSelectedIds([])
			setSelectedFiles([])
			setPreviewFiles([])
			setShowPreviewModal(false)
			setLoading(false)
			setIsUploading(false)
			setUploadProgress({ completed: 0, total: 0 })
			setSearchQuery('')
			fetchMediaFiles()
		}
	}, [isOpen])

	useEffect(() => {
		fetchMediaFiles()
	}, [currentPage, perPage, activeMediaTab, searchQuery])

	// Computed values
	const canProceed = useMemo(() => {
		if (activeTab === 'library') {
			return selectedIds.length > 0
		} else {
			return selectedFiles.length > 0
		}
	}, [activeTab, selectedIds.length, selectedFiles.length])

	const previewMediaItems = useMemo(
		() =>
			previewFiles.map((file, index) => ({
				id:
					(file as any)?._id ||
					(file as any)?.tempId ||
					(typeof crypto !== 'undefined' && crypto.randomUUID
						? crypto.randomUUID()
						: Math.random().toString(36).substring(2, 15)),
				url: URL.createObjectURL(file),
				name: file.name || (file as any)?.fileName,
				type: file.type.startsWith('image/') ? ('image' as const) : ('video' as const),
				file,
				tempId: (file as any)?.tempId,
			})),
		[previewFiles],
	)

	// Event handlers
	const toggleSelect = (media: MediaItem) => {
		setSelectedIds((prev) => {
			const index = prev.indexOf(media.id)
			if (index > -1) {
				return prev.filter((id) => id !== media.id)
			} else {
				return [...prev, media.id]
			}
		})
	}

	const onFilesSelected = (files: File[]) => {
		const remainingSlots = MAX_FILES - selectedFiles.length
		if (remainingSlots <= 0) {
			toast.error(`Maximum ${MAX_FILES} files allowed`)
			return
		}

		const filesToAdd = files.slice(0, remainingSlots).map((file) => {
			const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
			;(file as any).tempId = tempId

			const mediaItem: MediaItem = {
				id: (file as any)?._id || (file as any)?.mediaFileId || tempId,
				url: URL.createObjectURL(file),
				name: file.name || (file as any)?.fileName,
				type: file.type.startsWith('image/') ? 'image' : 'video',
				size: file.size,
				file,
				tempId,
			}
			return mediaItem
		})

		setSelectedFiles((prev) => [...prev, ...filesToAdd])
		setPreviewFiles((prev) => [...prev, ...filesToAdd.map((item) => item.file!)])
		setPreviewCurrentIndex(Math.max(0, previewFiles.length))
		setShowPreviewModal(true)
	}

	const removeSelectedFile = (index: number) => {
		const file = selectedFiles[index]
		if (!file) return

		if (file.url.startsWith('blob:')) {
			URL.revokeObjectURL(file.url)
		}

		setSelectedFiles((prev) => prev.filter((_, i) => i !== index))

		const previewIndex = previewFiles.findIndex((f) => {
			if (file.tempId && (f as any).tempId) {
				return (f as any).tempId === file.tempId
			}
			return f === file.file || f.name === file.name
		})

		if (previewIndex > -1) {
			setPreviewFiles((prev) => prev.filter((_, i) => i !== previewIndex))
		}

		setPreviewCurrentIndex((prev) => {
			if (prev >= previewFiles.length - 1 && previewFiles.length > 1) {
				return previewFiles.length - 2
			} else if (previewFiles.length <= 1) {
				return 0
			}
			return prev
		})
	}

	const updatePreviewIndex = (newIndex: number) => {
		setPreviewCurrentIndex(newIndex)
	}

	const onAddMedia = (files: File[]) => {
		if (!files || files.length === 0) return

		const remainingSlots = MAX_FILES - previewFiles.length
		if (remainingSlots <= 0) {
			toast.error(`Maximum ${MAX_FILES} files allowed`)
			return
		}

		const filesToAdd = files.slice(0, remainingSlots)
		if (filesToAdd.length < files.length) {
			toast.error(`Only ${filesToAdd.length} files added. Maximum ${MAX_FILES} files allowed.`)
		}

		filesToAdd.forEach((file) => {
			const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
			const mediaItem: MediaItem = {
				id: tempId,
				url: URL.createObjectURL(file),
				name: file.name || (file as any)?.fileName,
				type: file.type.startsWith('image/') ? 'image' : 'video',
				size: file.size,
				file,
				tempId,
			}
			setSelectedFiles((prev) => [...prev, mediaItem])
		})

		setPreviewFiles((prev) => [...prev, ...filesToAdd])
	}

	const closePreviewModal = () => {
		previewMediaItems.forEach((item) => {
			if (item.url.startsWith('blob:')) {
				URL.revokeObjectURL(item.url)
			}
		})

		setPreviewFiles([])
		setShowPreviewModal(false)
		setPreviewCurrentIndex(0)

		selectedFiles.forEach((file) => {
			if (file.url.startsWith('blob:')) {
				URL.revokeObjectURL(file.url)
			}
		})
		setSelectedFiles([])
	}

	const handleBatchUpload = async (mediaData: any[]) => {
		if (mediaData.length === 0) return

		// Convert base64 cover to File for videos
		mediaData.forEach((item) => {
			if (item.type === 'video' && item.cover && !item.coverFile) {
				const baseName = item.name ? item.name.replace(/\.[^/.]+$/, '') : `cover-${Date.now()}`
				const coverFileName = `${baseName}-cover.jpg`
				item.coverFile = base64ToFile(item.cover, coverFileName, 'image/jpeg')
			}
		})

		setIsUploading(true)
		setUploadProgress({ completed: 0, total: mediaData.length })

		try {
			const results = await processUploads(mediaData)

			const emittedResults = results.map((r, index) => {
				const original = mediaData[index]
				return {
					id: r.mediaFileId,
					name: original?.name,
					type: original?.type,
					url: r.fileUrl || r.url,
					thumbnailUrl: original?.type === 'image' ? r.fileUrl || r.url : undefined,
					coverUrl: original?.type === 'video' ? r.coverUrl : undefined,
				}
			})

			onUploadComplete(emittedResults)
			setPreviewFiles([])
			setShowPreviewModal(false)
			toast.success(t('notifications.mediaUploadSuccess') || 'Upload completed successfully!')
		} catch (error) {
			toast.error(t('notifications.mediaUploadFailed') || 'Upload failed. Please try again.')
		} finally {
			setIsUploading(false)
		}
	}

	const handleSearch = (query: string) => {
		setSearchQuery(query)
		setCurrentPage(1)
	}

	const handleNext = () => {
		if (!canProceed) return

		if (activeTab === 'library') {
			const selected = mediaFiles.filter((m) => selectedIds.includes(m.id))
			onSelect(selected)
		} else {
			if (selectedFiles.length === 0) {
				return
			}
			onSelect(selectedFiles)
		}
		handleClose()
	}

	const handleClose = () => {
		// Clean up all blob URLs
		selectedFiles.forEach((file) => {
			if (file.url.startsWith('blob:')) {
				URL.revokeObjectURL(file.url)
			}
		})
		previewMediaItems.forEach((item) => {
			if (item.url.startsWith('blob:')) {
				URL.revokeObjectURL(item.url)
			}
		})

		// Reset all state
		setSelectedFiles([])
		setSelectedIds([])
		setPreviewFiles([])
		setShowPreviewModal(false)

		onClose()
	}

	return (
		<>
			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent className="max-w-6xl h-[80vh] p-0 overflow-hidden">
					<MediaGalleryHeader title={t('mediaLibrary.title') || 'Media Library'} />

					<div className="overflow-hidden">
						{/* Main Content */}
						<div className="flex flex-col h-[600px]">
							{/* Tab Navigation */}
							<MediaTabs activeTab={activeTab} tabs={tabs} onUpdateActiveTab={setActiveTab} />

							{/* Content Area */}
							<div className="flex-1 overflow-hidden">
								{/* Media Library Tab */}
								{activeTab === 'library' && (
									<MediaLibraryTab
										loading={loading}
										mediaFiles={mediaFiles}
										selectedIds={selectedIds}
										currentPage={currentPage}
										perPage={perPage}
										totalPages={totalPages}
										totalItems={totalItems}
										activeMediaTab={activeMediaTab}
										onUpdateActiveMediaTab={setActiveMediaTab}
										onUpdateCurrentPage={setCurrentPage}
										onUpdatePerPage={setPerPage}
										onToggleSelect={toggleSelect}
										onSearch={handleSearch}
									/>
								)}

								{/* Device Upload Tab */}
								{activeTab === 'device' && (
									<DeviceUploadTab
										selectedFiles={selectedFiles}
										maxFiles={MAX_FILES}
										onFilesSelected={onFilesSelected}
										onRemoveFile={removeSelectedFile}
									/>
								)}
							</div>

							{/* Footer */}
							<MediaGalleryFooter canProceed={canProceed} isUploading={isUploading} onNext={handleNext} />
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Preview Modal */}
			{showPreviewModal && (
				<MediaPreviewModal
					isOpen={showPreviewModal}
					mediaItems={previewMediaItems}
					currentIndex={previewCurrentIndex}
					enableVideoEdit={true}
					showEdit={true}
					showNextButton={true}
					maxFiles={MAX_FILES}
					isUploading={isUploading}
					uploadProgress={uploadProgress}
					onClose={closePreviewModal}
					onAddMedia={onAddMedia}
					onUpdateCurrentIndex={updatePreviewIndex}
					onNext={handleBatchUpload}
				/>
			)}
		</>
	)
}
