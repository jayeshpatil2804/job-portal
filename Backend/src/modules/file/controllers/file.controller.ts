import { Request, Response } from 'express';
import prisma from '../../../config/db';
import { supabase } from '../../../utils/supabase';
import path from 'path';

export const uploadFile = async (req: Request, res: Response) => {
    try {
        const file = (req as any).file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileExt = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
        const filePath = `resumes/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return res.status(500).json({ message: 'Failed to upload to Supabase' });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath);

        // Save to Database
        const fileData = await (prisma as any).file.create({
            data: {
                fileName: file.originalname,
                fileUrl: publicUrl,
                key: filePath,
                mimeType: file.mimetype,
                size: file.size,
                candidateId: (req as any).user.role === 'CANDIDATE' ? (req as any).user.id : undefined,
                recruiterId: (req as any).user.role === 'RECRUITER' ? (req as any).user.id : undefined
            }
        });

        res.status(201).json({
            message: 'File uploaded successfully to Supabase',
            file: fileData
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Failed to upload file' });
    }
};

export const deleteFile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const fileRecord = await (prisma as any).file.findUnique({
            where: { id }
        });

        if (!fileRecord) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete from Supabase Storage
        const { error: deleteError } = await supabase.storage
            .from('resumes')
            .remove([fileRecord.key]);

        if (deleteError) {
            console.error('Supabase delete error:', deleteError);
            // Continue to delete from DB even if SB delete fails (or handle as needed)
        }

        // Delete from DB
        await (prisma as any).file.delete({
            where: { id }
        });

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('File delete error:', error);
        res.status(500).json({ message: 'Failed to delete file' });
    }
};

export const updateFile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const file = (req as any).file;

        if (!file) {
            return res.status(400).json({ message: 'No new file uploaded' });
        }

        const fileRecord = await (prisma as any).file.findUnique({
            where: { id }
        });

        if (!fileRecord) {
            return res.status(404).json({ message: 'File not found' });
        }

        // 1. Delete OLD file from Supabase Storage
        const { error: deleteError } = await supabase.storage
            .from('resumes')
            .remove([fileRecord.key]);

        if (deleteError) {
            console.error('Supabase old file delete error:', deleteError);
            // We continue even if delete fails, but log it
        }

        // 2. Upload NEW file to Supabase Storage
        const fileExt = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return res.status(500).json({ message: 'Failed to upload new file to Supabase' });
        }

        // 3. Get New Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath);

        // 4. Update Database
        const updatedFileData = await (prisma as any).file.update({
            where: { id },
            data: {
                fileName: file.originalname,
                fileUrl: publicUrl,
                key: filePath,
                mimeType: file.mimetype,
                size: file.size,
                candidateId: (req as any).user.role === 'CANDIDATE' ? (req as any).user.id : undefined,
                recruiterId: (req as any).user.role === 'RECRUITER' ? (req as any).user.id : undefined
            }
        });

        res.json({
            message: 'File updated successfully',
            file: updatedFileData
        });
    } catch (error) {
        console.error('File update error:', error);
        res.status(500).json({ message: 'Failed to update file' });
    }
};

export const getFile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const fileRecord = await (prisma as any).file.findUnique({
            where: { id }
        });

        if (!fileRecord) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.json(fileRecord);
    } catch (error) {
        console.error('Get file error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
