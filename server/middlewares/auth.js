export const protect = (req, res, next) => {
    try {
        // get from clerkMiddleware - ' https://clerk.com/ '
        const { userId } = req.auth();

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Not authenticated"
            })
        }
        next()
    } catch (error) {
        res.status(501).json({
            success: false,
            error: true,
            message: error.message || error
        })
    }
}