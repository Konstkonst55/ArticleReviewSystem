using ArticleReviewSystem.Models;

namespace ArticleReviewSystem.Interfaces
{
    public interface IReviewAssignmentService
    {
        Task<IEnumerable<ReviewAssignment>> GetAssignmentsForReviewerAsync(int reviewerId);
        Task<bool> AssignReviewerAsync(int articleId, int reviewerId);
        Task<bool> RespondToAssignmentAsync(int assignmentId, bool isAccepted);
    }
}
