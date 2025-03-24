import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import * as Haptics from 'expo-haptics';

type Lecture = {
  id: number;
  subject: string;
  score: number;
  date: string;
};

type SortField = "subject" | "score" | "date";
type SortDirection = "asc" | "desc";

export default function LecturesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [lectures, setLectures] = useState<Lecture[]>([
    { id: 1, subject: "Matematik", score: 66, date: "24 Mar 25" },
    { id: 2, subject: "Deneme", score: 20, date: "23 Mar 25" },
    { id: 3, subject: "Deneme", score: 70, date: "22 Mar 25" },
    { id: 4, subject: "Matematik", score: 70, date: "21 Mar 25" },
    { id: 5, subject: "Fizik", score: 50, date: "21 Mar 25" },
    { id: 6, subject: "Fizik", score: 50, date: "17 Mar 25" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  // Bottom sheet ref and snap points
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["32%"], []);
  // Why 33%? Because I'm an ultra super super maxium premium plus pro senior designer and that's the way I wanted it to be.

  // Debug log for checking modal ref
  useEffect(() => {
    console.log("BottomSheetModal Ref:", bottomSheetModalRef.current);
  }, []);

  const handlePresentModalPress = useCallback((lecture: Lecture) => {
    try {
      setSelectedLecture(lecture);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (bottomSheetModalRef.current) {
        bottomSheetModalRef.current.present();
      } else {
        console.error("bottomSheetModalRef.current is null");
      }
    } catch (error) {
      console.error("Error presenting bottom sheet:", error);
    }
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedLecture(null);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    []
  );

  const totalRecords = lectures.length;

  // Sorting functions
  const sortData = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if the same field is clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <Ionicons name="swap-vertical" size={14} color="#666" />;
    }
    return sortDirection === "asc"
      ? <Ionicons name="chevron-up" size={14} color="#0284c7" />
      : <Ionicons name="chevron-down" size={14} color="#0284c7" />;
  };

  // Get sorted data
  const getSortedData = () => {
    const sortedData = [...lectures];

    sortedData.sort((a, b) => {
      if (sortField === "subject") {
        return sortDirection === "asc"
          ? a.subject.localeCompare(b.subject)
          : b.subject.localeCompare(a.subject);
      } else if (sortField === "score") {
        return sortDirection === "asc"
          ? a.score - b.score
          : b.score - a.score;
      } else { // date
        // Converting DD MMM YY format to a comparable date for sorting
        const parseDate = (dateStr: string) => {
          const [day, month, year] = dateStr.split(" ");
          const monthMap: { [key: string]: number } = {
            "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
            "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
          };
          return new Date(parseInt(`20${year}`), monthMap[month], parseInt(day));
        };

        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
    });

    return sortedData;
  };

  const sortedLectures = getSortedData();

  const handleDelete = () => {
    if (selectedLecture) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLectures(prevLectures => prevLectures.filter(lecture => lecture.id !== selectedLecture.id));
      bottomSheetModalRef.current?.dismiss();
    }
  };

  const handleEdit = (lecture: Lecture) => {
    // In a real app, you might open a modal or navigate to an edit screen
    console.log("Edit lecture:", lecture);
  };

  const renderRightActions = (lecture: Lecture) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          className="bg-zinc-300 justify-center items-center px-4"
          onPress={() => handleEdit(lecture)}
        >
          <Ionicons name="create-outline" size={16} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 justify-center items-center px-4"
          onPress={() => handlePresentModalPress(lecture)}
        >
          <Ionicons name="trash-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View className="flex-row bg-gray-100 py-3 px-4 border-b border-b-gray-200">
      <TouchableOpacity onPress={() => sortData("subject")} className="flex-1 flex-row items-center gap-1.5">
        <View className="flex-1 flex-row items-center gap-1.5">
          <Text className={`font-medium ${sortField === "subject" ? "text-blue-600" : "text-gray-800"}`}>Ders</Text>
          {getSortIcon("subject")}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => sortData("score")} className="flex-1 flex-row items-center gap-1.5">
        <View className="flex-1 flex-row items-center gap-1.5">
          <Text className={`font-medium ${sortField === "score" ? "text-blue-600" : "text-gray-800"}`}>Çözülen</Text>
          {getSortIcon("score")}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => sortData("date")} className="flex-1 flex-row items-center gap-1.5">
        <View className="flex-1 flex-row items-center gap-1.5">
          <Text className={`font-medium ${sortField === "date" ? "text-blue-600" : "text-gray-800"}`}>Tarih</Text>
          {getSortIcon("date")}
        </View>
      </TouchableOpacity>
    </View>
  );

  // Test button to manually trigger the modal
  const testModal = () => {
    if (lectures.length > 0) {
      handlePresentModalPress(lectures[0]);
    }
  };

  return (
    <View className="flex-1 bg-white px-4 py-4">
      <View className="flex-row mb-4 gap-3">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-2xl px-3 py-0.5">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 text-gray-800 px-2 text-sm"
            placeholder="Ara"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <ScrollView className="flex-1 rounded-xl overflow-hidden mb-4 border border-gray-200">
        {renderHeader()}

        {sortedLectures.map((lecture) => (
          <Swipeable
            key={lecture.id}
            renderRightActions={() => renderRightActions(lecture)}
            friction={2}
            overshootRight={false}
          >
            <View className="flex-row py-3 px-4 bg-white border-b border-b-gray-200">
              <Text className="flex-1 text-gray-800">{lecture.subject}</Text>
              <Text className="flex-1 text-gray-800">{lecture.score}</Text>
              <Text className="flex-1 text-gray-800">{lecture.date}</Text>
            </View>
          </Swipeable>
        ))}
      </ScrollView>

      <View className="flex-row justify-between items-center py-3">
        <Text className="text-gray-500 text-xs">
          Toplam {totalRecords} kayıt
        </Text>
        <View className="flex-row items-center gap-3">
          <Text className="text-gray-500 text-xs">
            Sayfa {currentPage} / {Math.ceil(totalRecords / 10)}
          </Text>
          <View className="flex-row gap-1.5">
            <TouchableOpacity
              disabled={currentPage === 1}
              className={`bg-blue-500 rounded p-1.5 ${currentPage === 1 ? 'bg-gray-300' : ''}`}
            >
              <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? "#666" : "#fff"} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={currentPage === Math.ceil(totalRecords / 10)}
              className={`bg-blue-500 rounded p-1.5 ${currentPage === Math.ceil(totalRecords / 10) ? 'bg-gray-300' : ''}`}
            >
              <Ionicons name="chevron-forward" size={16} color={currentPage === Math.ceil(totalRecords / 10) ? "#666" : "#fff"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Delete Confirmation Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        enablePanDownToClose
      >
        <View className="flex-1 p-6 ">
          <Text className="text-xl font-medium text-gray-800 mb-2">Kaydı Sil</Text>
          <Text className="text-gray-600 mb-6">
            {selectedLecture ? `"${selectedLecture.subject}" kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.` : ''}
          </Text>
          <View className="flex-col justify-center items-center w-full gap-4">
            <TouchableOpacity
              onPress={() => bottomSheetModalRef.current?.dismiss()}
              className="py-4 rounded-lg bg-gray-200 w-full items-center"
            >
              <Text className="text-gray-800 font-medium">İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="py-4 rounded-lg bg-red-500 w-full items-center"
            >
              <Text className="text-white font-medium">Sil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
}