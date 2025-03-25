import { json } from '@sveltejs/kit';
import { updateBoss } from '.../../../../server/test.js';

export async function POST({ bossStatus }) {
    try {
        const { version, status } = await bossStatus.json(); // Read JSON body

        if (!version || status) {
            return json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const success = await updateBoss(bossStatus);

        if (success) {
            return json({ success: true, message: 'Boss info updated successfully' });
        } else {
            return json({ success: false, error: 'No rows updated' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating boss info:', error);
        return json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}